import { Types } from "mongoose";

export interface IUserRepository {
  findById(userId: string): Promise<User | null>;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export const IUserRepository = Symbol("IUserRepository");
