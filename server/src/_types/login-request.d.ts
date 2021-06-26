import { ObjectID } from 'mongodb';

export interface LoginRequest {
  redirectUrl: string;
  applicationId: ObjectID;
}
