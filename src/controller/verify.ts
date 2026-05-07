import express from 'express';
import jwt from 'jsonwebtoken';

import Application from '../models/Application';
import User from '../models/User';

import { ErrorDetailTypes, ErrorTypes } from '../_enums/errorTypes';
import { StrategyTypes } from '../_enums/strategyTypes';

import { decodeRequest } from '../util/base64';
import { Profile, VerifyCallback } from 'passport-google-oauth20';

export default async (
  req: express.Request,
  _accessToken: string,
  _refreshToken: string,
  profile: Profile,
  callback: VerifyCallback
) => {
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
            { algorithm: 'RS256', expiresIn: '15 days' }
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
          { algorithm: 'RS256', expiresIn: '15 days' }
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
        { algorithm: 'RS256', expiresIn: '15 days' }
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
    return callback(new Error(String(err)), undefined, {
      type: ErrorTypes.InternalServerError,
      detail: ErrorDetailTypes.InternalServerError,
    });
  }
};
