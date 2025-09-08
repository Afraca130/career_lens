import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientGrpc, Client } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { join } from "path";

/**
 * gRPC 인증 클라이언트
 * 다른 서비스에서 인증 서비스와 통신하기 위한 클라이언트
 */
@Injectable()
export class AuthGrpcClient implements OnModuleInit {
  @Client({
    transport: 2, // Transport.GRPC
    options: {
      package: "auth",
      protoPath: join(__dirname, "../../../../proto/auth.proto"),
      url: process.env.AUTH_SERVICE_GRPC_URL || "localhost:50051",
    },
  })
  private client: ClientGrpc;

  private authService: any;

  onModuleInit() {
    this.authService = this.client.getService("AuthService");
  }

  /**
   * 회원가입
   */
  signup(data: {
    name: string;
    email: string;
    password: string;
    sign_type?: string;
  }): Observable<any> {
    return this.authService.signup(data);
  }

  /**
   * 로그인
   */
  login(data: { email: string; password: string }): Observable<any> {
    return this.authService.login(data);
  }

  /**
   * 토큰 검증
   */
  verifyToken(data: { token: string }): Observable<any> {
    return this.authService.verifyToken(data);
  }

  /**
   * 사용자 정보 조회
   */
  getUser(data: { user_id: string }): Observable<any> {
    return this.authService.getUser(data);
  }

  /**
   * 비밀번호 변경
   */
  changePassword(data: {
    user_id: string;
    new_password: string;
  }): Observable<any> {
    return this.authService.changePassword(data);
  }
}
