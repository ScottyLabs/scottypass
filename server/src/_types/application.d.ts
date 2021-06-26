import { ObjectID } from 'mongodb';

export interface Application {
  _id: ObjectID;
  name: string;
  publicKey: string;
  userId: ObjectID;
  verifyEndpoint: string;
}
