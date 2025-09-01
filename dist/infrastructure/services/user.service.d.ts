import { IUserService } from "../../domain/user/user.service.interface";
import { User } from "../../domain/user/entity/user.entity";
export declare class UserService implements IUserService {
    canChangePassword(user: User): boolean;
    validatePasswordChange(user: User, newPassword: string): void;
}
