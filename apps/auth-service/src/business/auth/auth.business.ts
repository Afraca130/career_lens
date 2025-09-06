import { Injectable } from "@nestjs/common";
import { AuthContext } from "../../context/auth/auth.context";
import {
  SignupRequest,
  LoginRequest,
  LoginResponse,
} from "../../context/auth/interfaces";
import { User } from "../../domain/user/entity/user.entity";

@Injectable()
export class AuthBusiness {
  constructor(private readonly authContext: AuthContext) {}

  async signup(request: SignupRequest): Promise<User> {
    return this.authContext.signup(request);
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    return this.authContext.login(request);
  }

  async verifyToken(token: string): Promise<any> {
    return this.authContext.verifyToken(token);
  }
}
