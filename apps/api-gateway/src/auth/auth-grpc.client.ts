import { Injectable, OnModuleInit, Inject } from "@nestjs/common";
import { ClientGrpc } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { AuthMicroservice } from "@app/common";

@Injectable()
export class AuthGrpcClient implements OnModuleInit {
  private authService: AuthMicroservice.AuthServiceClient;

  constructor(@Inject("AUTH_SERVICE") private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthMicroservice.AuthServiceClient>("AuthService");
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

  refreshToken(
    data: AuthMicroservice.RefreshTokenRequest
  ): Observable<AuthMicroservice.RefreshTokenResponse> {
    return this.authService.refreshToken(data);
  }
}
