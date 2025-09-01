import { IUserRepository } from "../../domain/user/user.repository.interface";
import { IAuthService } from "../../domain/auth/auth.service.interface";
import { IUserService } from "../../domain/user/user.service.interface";
import { User } from "../../domain/user/entity/user.entity";
import { ChangePasswordRequest } from "./interfaces";
export declare class UserContext {
    private readonly userRepository;
    private readonly authService;
    private readonly userService;
    constructor(userRepository: IUserRepository, authService: IAuthService, userService: IUserService);
    changePassword(request: ChangePasswordRequest): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
