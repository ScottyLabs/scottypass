import express from 'express';
import session from 'express-session';
import { SiteError } from './util/errors/error';
import { errorHandler } from './util/errors/errorHandler';

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ErrorDetailTypes, ErrorTypes } from './_enums/errorTypes';

const app = express();
const port = 4000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('trust proxy', true);
app.set('view engine', 'ejs');
app.use(express.static('public'));

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

app.get('/login', (req, res, next) => {
  res.send('Hello World!');
});

app.all('*', (req, res, next) => {
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