import mongoose from 'mongoose';
import { RoleTypes } from '../_enums/roleTypes';
import { DashboardUser } from '../_types';

const dashboardUserSchema = new mongoose.Schema({
  email: String,
  role: {
    type: String,
    enum: Object.values(RoleTypes)
  },
  whitelist: [mongoose.Schema.Types.ObjectId]
});

export default mongoose.model<DashboardUser>('DashboardUser', dashboardUserSchema);