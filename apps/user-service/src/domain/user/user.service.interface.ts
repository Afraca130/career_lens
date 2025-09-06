import { User } from "./entity/user.entity";

export interface IUserService {
  canChangePassword(user: User): boolean;
  validatePasswordChange(user: User, newPassword: string): void;
}
