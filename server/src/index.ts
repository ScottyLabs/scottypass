import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose, { ObjectId } from 'mongoose';
import session from 'express-session';
import { SiteError } from './util/errors/error';
import { errorHandler } from './util/errors/errorHandler';

import passport from 'passport';
import { AuthenticateOptionsGoogle, Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ErrorDetailTypes, ErrorTypes } from './_enums/errorTypes';
import checkDB from './util/checkDB';
import User from './models/User';

import jwt from 'jsonwebtoken';
import { LoginRequest } from './_types';
import Application from './models/Application';
import { decodeRequest, encodeRequest } from './util/base64';
import { StrategyTypes } from './_enums/strategyTypes';
import { generateNonce } from './util/nonce';

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '', { useNewUrlParser: true, useUnifiedTopology: true });
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }

  await checkDB();

  const app = express();
  const port = 4000;

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(cors());
  app.set('trust proxy', true);
  app.set('view engine', 'ejs');
  app.use('/static', express.static(path.join(process.cwd(), 'views', 'static')))

  // Initialize Express Session
  app.use(
    session({
      secret: process.env.SESSION_SECRET || '1',
      resave: false,
      saveUninitialized: true,
    })
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id: ObjectId, done) => {
    User.findById(id, null, null, (err, user) => done(err, user));
  });

  // Initialize Google Strategy for Passport
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: process.env.ROOT_URL
          ? process.env.ROOT_URL + '/login/google/redirect'
          : 'http://localhost:3000/login/google/redirect',
        passReqToCallback: true,
      },
      async (req, _accessToken, _refreshToken, profile, callback) => {
        try {
          const request = decodeRequest(String(req.session.lastQuery));
          const application = await Application.findById(request.applicationId);
          if (!application) {
            return callback(
              new Error(ErrorTypes.BadRequest + ':' + ErrorDetailTypes.BadRequest + ':Invalid application on request')
            );
          }
          const key = process.env.DASHBOARD_SK || '';
          const user = await User.findOne({ identifier: profile.id, applicationId: request.applicationId });
          if (user !== null) {
            if (user.accessToken !== undefined) {
              try {
                jwt.verify(user.accessToken, key);
              } catch {
                user.accessToken = jwt.sign(
                  {
                    applicationId: request.applicationId,
                    userId: user._id,
                    email: user.email,
                  },
                  key,
                  { algorithm: !application.symmetric ? 'RS256' : 'HS256', expiresIn: '15 days' }
                );
                await user.save();
              }
              return callback(null, {
                _id: user._id,
                applicationId: user.applicationId,
                email: user.email,
                accessToken: user.accessToken,
              });
            } else {
              user.accessToken = jwt.sign(
                {
                  applicationId: request.applicationId,
                  userId: user._id,
                  email: user.email,
                },
                key,
                { algorithm: !application.symmetric ? 'RS256' : 'HS256', expiresIn: '15 days' }
              );
              await user.save();

              return callback(null, {
                _id: user._id,
                applicationId: user.applicationId,
                email: user.email,
                accessToken: user.accessToken,
              });
            }
          } else {
            const newUser = new User({
              applicationId: request.applicationId,
              email: profile._json.email,
              strategy: StrategyTypes.GOOGLE,
              identifier: profile.id,
            });
            newUser.accessToken = jwt.sign(
              {
                applicationId: request.applicationId,
                userId: newUser._id,
                email: newUser.email,
              },
              key,
              { algorithm: !application.symmetric ? 'RS256' : 'HS256', expiresIn: '15 days' }
            );
            await newUser.save();
            return callback(null, {
              _id: newUser._id,
              applicationId: newUser.applicationId,
              email: newUser.email,
              accessToken: newUser.accessToken,
            });
          }
        } catch (err) {
          console.error(err);
          return callback(err, undefined, {
            type: ErrorTypes.InternalServerError,
            detail: ErrorDetailTypes.InternalServerError,
          });
        }
      }
    )
  );

  app.get('/login', (_req, _res, next) => {
    const err = new SiteError(
      ErrorTypes.NotFound,
      ErrorDetailTypes.NotFound,
      'The link you entered may have been incorrect.'
    );
    next(err);
  });

  app.get('/login/google/redirect', (req, res, next) => {
    passport.authenticate('google', function (err, user) {
      const { state } = req.query;
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

  app.get('/login/google', (req, res, next) => {
    req.session.nonce = generateNonce();
    if (!req.session.lastQuery) {
      req.session.lastQuery = encodeRequest({
        applicationId: new mongoose.Types.ObjectId('0'.repeat(12)),
        restrictDomain: true,
        redirectUrl: process.env.ROOT_URL ? process.env.ROOT_URL : 'http://localhost:3000',
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

  app.get('/login/pubkey', (req, res) => {
    res.type('text/plain');
    res.send(process.env.DASHBOARD_PK);
  });

  app.get('/login/:token', async (req, res, next) => {
    const { token } = req.params;
    try {
      const request = jwt.decode(token) as LoginRequest;
      const application = await Application.findById(request.applicationId);
      if (application) {
        jwt.verify(token, application.publicKey || '', { algorithms: ['HS256', 'RS256'] });
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

  app.all('*', (_req, _res, next) => {
    const err = new SiteError(
      ErrorTypes.NotFound,
      ErrorDetailTypes.NotFound,
      'The link you entered may have been incorrect.'
    );
    next(err);
  });

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`App listening at port ${port}`);
  });
})();
