import mongoose from 'mongoose';
import { RoleTypes } from '../_enums/roleTypes';

export interface DashboardUser {
  _id: mongoose.Types.ObjectId;
  email: string;
  role: RoleTypes;
  whitelist: Array<mongoose.Types.ObjectId>
}