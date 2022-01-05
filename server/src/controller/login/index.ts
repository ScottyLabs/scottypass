import { Router } from 'express';
import passport from 'passport';
import { AuthenticateOptionsGoogle } from 'passport-google-oauth20';
import { encodeRequest } from '../../util/base64';
import { decodeRequest } from '../../util/base64';
import { generateNonce } from '../../util/nonce';
import { SiteError } from '../../util/errors/error';
import { ErrorDetailTypes } from '../../_enums/errorTypes';
import { ErrorTypes } from '../../_enums/errorTypes';
import { LoginRequest } from '../../_types';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Application from '../../models/Application';

const router = Router();

router.get('/google/redirect', (req, res, next) => {
  passport.authenticate('google', function (err, user) {
    const { state } = req.query;
    console.log(state);
    if (String(state) !== req.session.nonce) {
      return next(
        new SiteError(
          ErrorTypes.Unauthorized,
          ErrorDetailTypes.Unauthorized,
          'You attempted to access this page directly without passing through the login.'
        )
      );
    }
    delete req.session.nonce;
    if (err) {
      const [type, detail, message] = err.message.split(':');
      return next(new SiteError(type, detail, message));
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(new SiteError(ErrorTypes.InternalServerError, ErrorDetailTypes.InternalServerError, err.message));
      }
      const request = decodeRequest(String(req.session.lastQuery));
      res.render('return', { response: user.accessToken, targetOrigin: request.redirectUrl });
    });
  })(req, res);
});

router.get('/google', (req, res, next) => {
  req.session.nonce = generateNonce();
  if (!req.session.lastQuery) {
    req.session.lastQuery = encodeRequest({
      applicationId: new mongoose.Types.ObjectId('0'.repeat(12)),
      restrictDomain: true,
      redirectUrl: process.env.ROOT_URL ? process.env.ROOT_URL : 'http://localhost:4000',
    });
  }
  const options: AuthenticateOptionsGoogle = {
    scope: ['profile', 'email'],
    state: req.session.nonce,
  };
  const { restrictDomain } = decodeRequest(req.session.lastQuery);
  if (restrictDomain) {
    options.hd = 'andrew.cmu.edu';
  }
  const authenticator = passport.authenticate('google', options);
  authenticator(req, res, next);
});

router.get('/pubkey', (req, res) => {
  res.type('text/plain');
  res.send(process.env.DASHBOARD_PK);
});

router.get('/:token', async (req, res, next) => {
  const { token } = req.params;
  try {
    const request = jwt.decode(token) as LoginRequest;
    const application = await Application.findById(request.applicationId);
    if (application) {
      jwt.verify(token, application.publicKey || '', { algorithms: application.symmetric ? ['HS256'] : ['RS256'] });
      req.session.lastQuery = encodeRequest(request);
      res.redirect(`/login/google`);
    } else {
      next(
        new SiteError(
          ErrorTypes.BadRequest,
          ErrorDetailTypes.BadRequest,
          'The Login Request specified an invalid application.'
        )
      );
    }
  } catch (err) {
    console.error(err);
    next(new SiteError(ErrorTypes.InternalServerError, ErrorDetailTypes.InternalServerError, 'A problem occurred.'));
  }
});

export default router;
