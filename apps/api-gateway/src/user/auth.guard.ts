import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { UserGrpcClient } from "./user-grpc.client";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(UserGrpcClient) private readonly userGrpcClient: UserGrpcClient
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException("Authorization header is required");
    }

    const token = authorization.replace("Bearer ", "");

    return this.userGrpcClient
      .verifyToken({ token })
      .toPromise()
      .then(
        (result) => {
          if (result && result.userId) {
            // 사용자 ID를 헤더에 추가하여 컨트롤러에서 사용할 수 있도록 함
            request.headers["user-id"] = result.userId;
            return true;
          }
          throw new UnauthorizedException("Invalid token");
        },
        () => {
          throw new UnauthorizedException("Invalid token");
        }
      );
  }
}
