import { AuthBusiness } from "../../business/auth/auth.business";
import { SignupDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { User } from "../../domain/user/entity/user.entity";
export declare class AuthController {
    private readonly authBusiness;
    constructor(authBusiness: AuthBusiness);
    signup(signupDto: SignupDto): Promise<User>;
    login(loginDto: LoginDto): Promise<import("../../context/auth/interfaces").LoginResponse>;
    verifyToken(authorization: string): Promise<any>;
}
