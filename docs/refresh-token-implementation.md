# Refresh Token 구현 가이드

## 개요

Access Token과 Refresh Token을 사용한 JWT 인증 시스템을 구현했습니다. Access Token은 30분, Refresh Token은 15일의 유효기간을 가집니다.

## 토큰 구조

### 🔑 Access Token
- **유효기간**: 30분
- **용도**: API 요청 시 인증
- **저장 위치**: 클라이언트 메모리 (보안상 권장)

### 🔄 Refresh Token
- **유효기간**: 15일
- **용도**: Access Token 재발급
- **저장 위치**: 데이터베이스 + 클라이언트 (httpOnly 쿠키 권장)

## 구현 세부사항

### 1. 데이터베이스 스키마

```sql
ALTER TABLE users ADD COLUMN refresh_token VARCHAR(500);
```

### 2. 도메인 엔티티 업데이트

```typescript
export class User {
  constructor(
    // ... 기존 필드들
    public readonly refreshToken?: string
  ) {}

  updateRefreshToken(refreshToken: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.role,
      this.signType,
      this.isVerified,
      this.isDeleted,
      this.createdAt,
      new Date(),
      refreshToken
    );
  }
}
```

### 3. Auth Service 업데이트

```typescript
export class AuthService implements IAuthService {
  generateToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "30m", // Access Token: 30분
    });
  }

  generateRefreshToken(payload: any): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || "your-secret-key",
      expiresIn: "15d", // Refresh Token: 15일
    });
  }
}
```

### 4. 로그인 프로세스

```typescript
async login(request: LoginRequest): Promise<LoginResponse> {
  // 1. 사용자 인증
  const user = await this.userRepository.findByEmail(request.email);
  if (!user || !await this.authService.comparePassword(request.password, user.password)) {
    throw new InvalidCredentialsException();
  }

  // 2. 토큰 생성
  const accessToken = this.authService.generateToken({
    userId: user.id,
    email: user.email,
    type: "access",
  });

  const refreshToken = this.authService.generateRefreshToken({
    userId: user.id,
    email: user.email,
    type: "refresh",
  });

  // 3. Refresh Token 저장
  await this.userRepository.updateRefreshToken(user.id, refreshToken);

  // 4. 응답 반환
  return new LoginResponse(accessToken, refreshToken, userInfo);
}
```

### 5. 토큰 갱신 프로세스

```typescript
async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
  try {
    // 1. Refresh Token 검증
    const payload = this.authService.verifyToken(request.refresh_token);
    
    // 2. 사용자 조회
    const user = await this.userRepository.findByRefreshToken(request.refresh_token);
    if (!user) {
      throw new InvalidTokenException("Invalid refresh token");
    }

    // 3. 새로운 토큰 생성
    const newAccessToken = this.authService.generateToken({
      userId: user.id,
      email: user.email,
      type: "access",
    });

    const newRefreshToken = this.authService.generateRefreshToken({
      userId: user.id,
      email: user.email,
      type: "refresh",
    });

    // 4. 새로운 Refresh Token 저장
    await this.userRepository.updateRefreshToken(user.id, newRefreshToken);

    return new RefreshTokenResponse(newAccessToken, newRefreshToken);
  } catch (error) {
    throw new InvalidTokenException("Invalid refresh token");
  }
}
```

## API 엔드포인트

### 🔐 로그인

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**응답:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user"
  }
}
```

### 🔄 토큰 갱신

```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**응답:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 🔍 토큰 검증

```http
POST /auth/verify
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**응답:**
```json
{
  "userId": "user-id",
  "email": "user@example.com",
  "type": "access",
  "iat": 1640995200,
  "exp": 1640997000
}
```

## gRPC 서비스

### Proto 파일 정의

```protobuf
service AuthService {
  rpc Login(LoginRequest) returns (LoginResponse);
  rpc RefreshToken(RefreshTokenRequest) returns (RefreshTokenResponse);
  rpc VerifyToken(VerifyTokenRequest) returns (VerifyTokenResponse);
}

message LoginResponse {
  string access_token = 1;
  string refresh_token = 2;
  UserInfo user = 3;
}

message RefreshTokenRequest {
  string refresh_token = 1;
}

message RefreshTokenResponse {
  string access_token = 1;
  string refresh_token = 2;
}
```

### gRPC 클라이언트 사용

```typescript
// 로그인
const loginResponse = await authGrpcClient.login({
  email: "user@example.com",
  password: "password123"
}).toPromise();

// 토큰 갱신
const refreshResponse = await authGrpcClient.refreshToken({
  refresh_token: loginResponse.refresh_token
}).toPromise();
```

## 보안 고려사항

### 1. 토큰 저장
- **Access Token**: 클라이언트 메모리에 저장 (XSS 공격 방지)
- **Refresh Token**: httpOnly 쿠키에 저장 (CSRF 공격 방지)

### 2. 토큰 갱신 전략
- **자동 갱신**: Access Token 만료 전 자동으로 갱신
- **토큰 로테이션**: Refresh Token도 함께 갱신하여 보안 강화

### 3. 토큰 무효화
- **로그아웃 시**: Refresh Token을 데이터베이스에서 삭제
- **보안 위협 시**: 모든 토큰 무효화

## 클라이언트 구현 예시

### JavaScript/TypeScript

```typescript
class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  async login(email: string, password: string) {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    // Refresh Token을 httpOnly 쿠키에 저장
    document.cookie = `refresh_token=${data.refresh_token}; httpOnly; secure; sameSite=strict`;
  }

  async refreshAccessToken() {
    if (!this.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: this.refreshToken })
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    
    return this.accessToken;
  }

  async makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    if (!this.accessToken) {
      throw new Error('No access token available');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${this.accessToken}`
      }
    });

    // Access Token 만료 시 자동 갱신
    if (response.status === 401) {
      await this.refreshAccessToken();
      return this.makeAuthenticatedRequest(url, options);
    }

    return response;
  }
}
```

### React Hook 예시

```typescript
import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const response = await fetch('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  };

  const refreshAccessToken = async () => {
    if (!refreshToken) return;

    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: refreshToken })
    });

    const data = await response.json();
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);
  };

  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    // Refresh Token 쿠키 삭제
    document.cookie = 'refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  };

  return {
    accessToken,
    refreshToken,
    login,
    refreshAccessToken,
    logout,
    isAuthenticated: !!accessToken
  };
};
```

## 테스트

### 1. 로그인 테스트

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. 토큰 갱신 테스트

```bash
curl -X POST http://localhost:3001/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refresh_token":"your-refresh-token"}'
```

### 3. gRPC 테스트

```bash
# grpcurl을 사용한 gRPC 테스트
grpcurl -plaintext -d '{"email":"test@example.com","password":"password123"}' \
  localhost:50051 auth.AuthService/Login

grpcurl -plaintext -d '{"refresh_token":"your-refresh-token"}' \
  localhost:50051 auth.AuthService/RefreshToken
```

## 모니터링

### 1. 토큰 사용 통계
- Access Token 발급 횟수
- Refresh Token 사용 횟수
- 토큰 만료 시간별 통계

### 2. 보안 이벤트
- 잘못된 Refresh Token 사용 시도
- 토큰 갱신 실패 횟수
- 비정상적인 토큰 사용 패턴

이 Refresh Token 구현을 통해 보안성과 사용자 경험을 모두 향상시킬 수 있습니다.
