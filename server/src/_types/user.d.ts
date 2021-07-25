import mongoose from 'mongoose';
import { StrategyTypes } from '../_enums/strategyTypes';

export interface User {
  _id: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  email: string;
  accessToken: string;
  strategy: StrategyTypes;
  identifier: string;
}

declare global {
  namespace Express {
    interface User {
      _id?: mongoose.Types.ObjectId;
      applicationId?: mongoose.Types.ObjectId;
      email?: string;
      accessToken?: string;
    }
  }
}
