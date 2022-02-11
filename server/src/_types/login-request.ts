import mongoose from 'mongoose';

export interface LoginRequest {
  redirectUrl: string;
  restrictDomain: boolean;
  applicationId: mongoose.Types.ObjectId;
}
