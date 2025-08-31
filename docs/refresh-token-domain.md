# Refresh Token Domain

액세스 토큰 만료 시 리프레시 토큰을 사용하여 새로운 액세스 토큰을 발급하는 도메인입니다.

## 아키텍처

### Clean Architecture 구조

```
src/
├── domain/auth/                    # 도메인 레이어
│   ├── refresh-token.command.ts   # 리프레시 토큰 명령
│   ├── refresh-token.port.ts      # 리프레시 토큰 포트 인터페이스
│   ├── refresh-token-result.interface.ts  # 결과 인터페이스
│   ├── refresh-token.exception.ts # 도메인 예외
│   ├── token.service.interface.ts # 토큰 서비스 인터페이스
│   └── user.repository.interface.ts # 사용자 저장소 인터페이스
├── business/auth/                  # 애플리케이션 레이어
│   └── refresh-token.use-case.ts  # 리프레시 토큰 유스케이스
├── infrastructure/auth/            # 인프라스트럭처 레이어
│   ├── token.service.ts           # 토큰 서비스 구현
│   ├── refresh-token.repository.ts # 리프레시 토큰 저장소 구현
│   └── user.repository.ts         # 사용자 저장소 구현
└── presentation/auth/              # 프레젠테이션 레이어
    ├── auth.controller.ts         # 인증 컨트롤러
    ├── dto/                       # 데이터 전송 객체
    │   ├── refresh-token-request.dto.ts
    │   └── refresh-token-response.dto.ts
    └── filters/                   # 예외 필터
        └── auth-exception.filter.ts
```

## 주요 컴포넌트

### 1. 도메인 레이어

#### RefreshTokenCommand

리프레시 토큰 작업을 위한 명령 객체입니다.

```typescript
export class RefreshTokenCommand {
  constructor(public readonly refreshToken: string) {}
}
```

#### RefreshTokenPort

리프레시 토큰 유스케이스의 포트 인터페이스입니다.

```typescript
export interface RefreshTokenPort {
  execute(command: RefreshTokenCommand): Promise<RefreshTokenResult>;
}
```

#### 도메인 예외

- `InvalidRefreshTokenException`: 유효하지 않은 리프레시 토큰
- `ExpiredRefreshTokenException`: 만료된 리프레시 토큰
- `RevokedRefreshTokenException`: 폐기된 리프레시 토큰
- `UserNotFoundException`: 사용자를 찾을 수 없음

### 2. 애플리케이션 레이어

#### RefreshTokenUseCase

리프레시 토큰 검증 및 새로운 토큰 발급 로직을 담당합니다.

**주요 단계:**

1. 리프레시 토큰 검증 및 사용자 정보 추출
2. 데이터베이스에서 리프레시 토큰 조회
3. 리프레시 토큰 상태 검증 (만료, 폐기 여부)
4. 사용자 정보 조회
5. 새로운 액세스 토큰 및 리프레시 토큰 생성
6. 새 리프레시 토큰 저장 및 기존 토큰 폐기
7. 새로운 토큰과 사용자 정보 반환

### 3. 인프라스트럭처 레이어

#### TokenService

JWT 토큰 생성 및 검증을 담당합니다.

- `verifyRefreshToken()`: 리프레시 토큰 검증
- `generateAccessToken()`: 액세스 토큰 생성 (24시간 유효)
- `generateRefreshToken()`: 리프레시 토큰 생성 (30일 유효)

#### RefreshTokenRepository

리프레시 토큰 데이터베이스 작업을 담당합니다.

- `create()`: 새 리프레시 토큰 생성
- `findByToken()`: 토큰으로 리프레시 토큰 조회
- `save()`: 리프레시 토큰 업데이트
- `deleteExpiredTokens()`: 만료된 토큰 삭제

### 4. 프레젠테이션 레이어

#### AuthController

HTTP 요청을 처리하고 적절한 응답을 반환합니다.

**엔드포인트:**

```
POST /auth/refresh
```

**요청 예시:**

```json
{
  "refresh_token": "a1b2c3d4e5f6789..."
}
```

**응답 예시:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "a1b2c3d4e5f6789...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "사용자 이름"
  }
}
```

#### AuthExceptionFilter

도메인 예외를 적절한 HTTP 응답으로 변환합니다.

- `InvalidRefreshTokenException` → 401 Unauthorized
- `ExpiredRefreshTokenException` → 401 Unauthorized
- `RevokedRefreshTokenException` → 401 Unauthorized
- `UserNotFoundException` → 404 Not Found

## 보안 고려사항

1. **토큰 폐기**: 새로운 리프레시 토큰이 발급되면 기존 토큰은 즉시 폐기됩니다.
2. **만료 시간**: 액세스 토큰은 24시간, 리프레시 토큰은 30일로 설정됩니다.
3. **토큰 검증**: 리프레시 토큰은 서명 검증과 데이터베이스 검증을 모두 거칩니다.
4. **예외 처리**: 모든 예외는 적절한 HTTP 상태 코드로 변환됩니다.

## 사용 방법

### 1. 모듈 등록

```typescript
import { AuthModule } from "./modules/auth.module";

@Module({
  imports: [AuthModule],
})
export class AppModule {}
```

### 2. 환경 변수 설정

```env
JWT_SECRET=your-access-token-secret
JWT_REFRESH_SECRET=your-refresh-token-secret
```

### 3. API 호출

```typescript
// 액세스 토큰이 만료되었을 때
const response = await fetch("/auth/refresh", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    refresh_token: "your-refresh-token",
  }),
});

const { access_token, refresh_token, user } = await response.json();
```

## 테스트

각 레이어별로 단위 테스트를 작성할 수 있습니다:

- **도메인 레이어**: 비즈니스 규칙 검증
- **애플리케이션 레이어**: 유스케이스 로직 검증
- **인프라스트럭처 레이어**: 데이터베이스 작업 검증
- **프레젠테이션 레이어**: HTTP 요청/응답 검증
