import { AuthContext } from "../../context/auth/auth.context";
import { SignupRequest, LoginRequest, LoginResponse } from "../../context/auth/interfaces";
import { User } from "../../domain/user/entity/user.entity";
export declare class AuthBusiness {
    private readonly authContext;
    constructor(authContext: AuthContext);
    signup(request: SignupRequest): Promise<User>;
    login(request: LoginRequest): Promise<LoginResponse>;
    verifyToken(token: string): Promise<any>;
}
