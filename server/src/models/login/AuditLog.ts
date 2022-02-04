import mongoose from 'mongoose';
import { AuditLog } from '../../_types';

const auditLogSchema = new mongoose.Schema({
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Application',
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'INFO', 'ERROR'],
    required: true,
  },
  statusCode: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    required: true,
  },
  message: String,
});

export default mongoose.model<AuditLog>('AuditLog', auditLogSchema);
