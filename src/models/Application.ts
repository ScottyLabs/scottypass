import mongoose from 'mongoose';
import { Application } from '../_types';

const applicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  publicKey: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: function (this: Application) {
      return this.name !== "API Dashboard"
    }
  },
  symmetric: {
    type: Boolean,
    default: false,
  },
  verifyEndpoint: {
    type: String,
    required: true,
  },
});

export default mongoose.model<Application>('Application', applicationSchema);
