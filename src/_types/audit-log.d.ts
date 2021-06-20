import { ObjectID } from 'mongodb';

export enum Status {
  Success,
  Info,
  Error,
}

export interface AuditLog {
  _id: ObjectID;
  applicationId: ObjectID;
  status: Status;
  statusCode: 200 | 400 | 500;
  userId: ObjectID;
  createdAt: Date;
  message: string;
}