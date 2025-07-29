import { User, UserProps } from "../entities/user.entity";

export const createUser = (props: UserProps): User => {
  return new User(props);
};

export const createUserFromDatabase = (data: {
  _id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}): User => {
  return new User({
    id: data._id,
    email: data.email,
    password: data.password,
    name: data.name,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  });
};

export const createUserForRegistration = (
  email: string,
  password: string,
  name: string
): User => {
  return new User({
    email,
    password,
    name,
  });
};
