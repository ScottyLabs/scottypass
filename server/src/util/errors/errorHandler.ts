import { Request, Response, NextFunction } from 'express';
import { SiteError } from './error';

export const errorHandler = (err: SiteError, req: Request, res: Response, next: NextFunction): void => {
  console.log(err);
  res.render('error', {
    root: process.env.ROOT_URL || 'http://localhost:4000',
    errstatus: err.status,
    errdetail: err.detail,
    errmsg: err.msg,
  });
};
