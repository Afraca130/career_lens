import { JwtService } from "@nestjs/jwt";
import { IAuthService } from "../../domain/auth/auth.service.interface";
export declare class AuthService implements IAuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    hashPassword(password: string): Promise<string>;
    comparePassword(password: string, hashedPassword: string): Promise<boolean>;
    generateToken(payload: any): string;
    verifyToken(token: string): any;
}
