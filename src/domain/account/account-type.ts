import { Types } from "mongoose";

export type Account = Readonly<{
  username: string;
  email: string;
  password: string;
}>;

export type AccountMongoDocument = Readonly<
  Account & {
    _id: Types.ObjectId;
  }
>;
