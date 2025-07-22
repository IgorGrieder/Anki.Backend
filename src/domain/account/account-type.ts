import { Types } from "mongoose";

export interface Account {
  readonly username: string;
  readonly email: string;
  readonly password: string;
}

export interface AccountMongoDocument extends Account {
  readonly _id: Types.ObjectId;
}
