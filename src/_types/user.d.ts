import { ObjectID } from 'mongodb';

export interface User {
  _id: ObjectID;
  applicationId: ObjectID;
  email: string;
  accessToken: string;
}