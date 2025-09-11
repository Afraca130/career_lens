import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { AuthMicroservice, UserMicroservice } from "@app/common";

@Injectable()
export class UserGrpcClient implements OnModuleInit {
  private authService: AuthMicroservice.AuthServiceClient;
  private userService: UserMicroservice.UserServiceClient;

  constructor(@Inject("USER_SERVICE") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthMicroservice.AuthServiceClient>("AuthService");
    this.userService =
      this.client.getService<UserMicroservice.UserServiceClient>("UserService");
  }

  // Auth Service Methods
  signup(
    data: AuthMicroservice.SignupRequest
  ): Observable<AuthMicroservice.SignupResponse> {
    return this.authService.signup(data);
  }

  login(
    data: AuthMicroservice.LoginRequest
  ): Observable<AuthMicroservice.LoginResponse> {
    return this.authService.login(data);
  }

  verifyToken(
    data: AuthMicroservice.VerifyTokenRequest
  ): Observable<AuthMicroservice.VerifyTokenResponse> {
    return this.authService.verifyToken(data);
  }

  refreshToken(
    data: AuthMicroservice.RefreshTokenRequest
  ): Observable<AuthMicroservice.RefreshTokenResponse> {
    return this.authService.refreshToken(data);
  }

  changePassword(
    data: UserMicroservice.ChangePasswordRequest
  ): Observable<UserMicroservice.ChangePasswordResponse> {
    return this.userService.changePassword(data);
  }

  // User Service Methods
  getUser(
    data: UserMicroservice.GetUserRequest
  ): Observable<UserMicroservice.GetUserResponse> {
    return this.userService.getUser(data);
  }

  updateProfile(
    data: UserMicroservice.UpdateProfileRequest
  ): Observable<UserMicroservice.UpdateProfileResponse> {
    return this.userService.updateProfile(data);
  }

  deleteUser(
    data: UserMicroservice.DeleteUserRequest
  ): Observable<UserMicroservice.DeleteUserResponse> {
    return this.userService.deleteUser(data);
  }

  getUsers(
    data: UserMicroservice.GetUsersRequest
  ): Observable<UserMicroservice.GetUsersResponse> {
    return this.userService.getUsers(data);
  }
}
