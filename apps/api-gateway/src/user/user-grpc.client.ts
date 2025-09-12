import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { AuthMicroservice, UserMicroservice } from "@app/common";

@Injectable()
export class UserGrpcClient implements OnModuleInit {
  private userService: UserMicroservice.UserServiceClient;
  private authService: AuthMicroservice.AuthServiceClient;

  constructor(@Inject("USER_SERVICE") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.userService =
      this.client.getService<UserMicroservice.UserServiceClient>("UserService");
    this.authService =
      this.client.getService<AuthMicroservice.AuthServiceClient>("AuthService");
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
