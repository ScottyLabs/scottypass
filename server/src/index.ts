import express from 'express';
import cors from 'cors';
import path from 'path';
import mongoose, { ObjectId } from 'mongoose';
import session from 'express-session';
import { SiteError } from './util/errors/error';
import { errorHandler } from './util/errors/errorHandler';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ErrorDetailTypes, ErrorTypes } from './_enums/errorTypes';
import checkDB from './util/checkDB';
import User from './models/login/User';

import loginRouter from './controller/login';

import verifyCallback from './controller/login/verify';

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
  app.use('/static', express.static(path.join(process.cwd(), 'views', 'static')));
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../../build')));
  }

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
      verifyCallback
    )
  );

  app.use('/login', loginRouter);

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
