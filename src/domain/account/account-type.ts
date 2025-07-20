import { Types } from 'mongoose';

export type Account = {
  username: string;
  email: string;
  password: string;
}

export type AccountMongoDocument = Account & {
  _id: Types.ObjectId;
}

