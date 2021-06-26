import { ObjectID } from 'mongodb';

export interface LoginResponse {
  applicationId: ObjectID;
  userID: ObjectID;
}
