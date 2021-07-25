import mongoose from 'mongoose';

export interface Application {
  _id?: mongoose.Types.ObjectId;
  name?: string;
  publicKey?: string;
  userId?: mongoose.Types.ObjectId;
  verifyEndpoint?: string;
}
