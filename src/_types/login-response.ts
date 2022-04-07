import mongoose from 'mongoose';

export interface LoginResponse {
  applicationId: mongoose.Types.ObjectId;
  userID: mongoose.Types.ObjectId;
  token: string;
}
