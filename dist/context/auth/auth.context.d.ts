import { IUserRepository } from "../../domain/user/user.repository.interface";
import { IAuthService } from "../../domain/auth/auth.service.interface";
import { User } from "../../domain/user/entity/user.entity";
import { SignupRequest, LoginRequest, LoginResponse } from "./interfaces";
export declare class AuthContext {
    private readonly userRepository;
    private readonly authService;
    constructor(userRepository: IUserRepository, authService: IAuthService);
    signup(request: SignupRequest): Promise<User>;
    login(request: LoginRequest): Promise<LoginResponse>;
    verifyToken(token: string): Promise<any>;
}
