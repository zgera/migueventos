import {User} from "@prisma/client";

export type UserSafe = Omit<User, 'password'>;

export interface CreateUserBody {
  firstName: string,
  lastName: string,
  username: string,
  document: number,
  email: string,
  password: string,
}