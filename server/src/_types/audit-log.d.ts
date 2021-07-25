import mongoose from 'mongoose';
import { AuditLogStatus } from '../_enums/auditLogStatusTypes';

export interface AuditLog {
  _id: mongoose.Types.ObjectId;
  applicationId: mongoose.Types.ObjectId;
  status: AuditLogStatus;
  statusCode: 200 | 400 | 500;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  message: string;
}
