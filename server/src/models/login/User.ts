import mongoose from 'mongoose';
import { StrategyTypes } from '../../_enums/strategyTypes';
import { User } from '../../_types';

const userSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref: Application
  },
  email: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  strategy: {
    type: String,
    required: true,
    enum: Object.values(StrategyTypes),
  },
  identifier: {
    type: String,
    required: true,
  },
});

export default mongoose.model<User>('User', userSchema);
