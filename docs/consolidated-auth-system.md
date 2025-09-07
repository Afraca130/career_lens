# 통합 인증 시스템 (Consolidated Authentication System)

## 개요

사용자 인증과 사용자 관리를 하나의 서비스로 통합하고, 보안을 강화한 인증 시스템을 구현했습니다.

## 주요 변경사항

### 1. 서비스 통합
- `auth-service`와 `user-service`를 하나로 통합
- 모든 사용자 관련 기능이 `auth-service`에서 처리됨

### 2. 보안 강화
- JWT 토큰 기반 인증으로 변경
- Authorization 헤더를 통한 사용자 식별
- 이메일/비밀번호를 직접 요청 본문에 포함하지 않음

### 3. 새로운 API 엔드포인트

#### 인증 관련
- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `POST /auth/verify` - 토큰 검증

#### 사용자 관리 (인증 필요)
- `GET /auth/me` - 내 정보 조회
- `PUT /auth/change-password` - 비밀번호 변경

## API 사용법

### 1. 회원가입
```bash
POST /auth/signup
Content-Type: application/json

{
  "name": "홍길동",
  "email": "user@example.com",
  "password": "password123"
}
```

### 2. 로그인
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

응답:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "홍길동",
    "role": "user"
  }
}
```

### 3. 내 정보 조회 (인증 필요)
```bash
GET /auth/me
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. 비밀번호 변경 (인증 필요)
```bash
PUT /auth/change-password
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "newPassword": "newPassword123"
}
```

## 보안 특징

### 1. JWT 인증 가드
- `JwtAuthGuard`를 통해 모든 보호된 엔드포인트에서 토큰 검증
- 유효하지 않은 토큰에 대한 자동 거부

### 2. 사용자 데코레이터
- `@User()` 데코레이터를 통해 JWT 토큰에서 사용자 정보 추출
- 컨트롤러에서 간편하게 사용자 정보 접근

### 3. 비밀번호 정책
- 소셜 로그인(kakao, naver) 사용자는 비밀번호 변경 불가
- 최소 6자 이상의 비밀번호 요구

## 아키텍처

### 레이어 구조
```
Presentation Layer (Controller)
    ↓
Business Layer (Business Logic)
    ↓
Context Layer (Application Logic)
    ↓
Domain Layer (Entities, Interfaces, Exceptions)
    ↓
Infrastructure Layer (Repositories, Services, Guards)
```

### 주요 컴포넌트
- `JwtAuthGuard`: JWT 토큰 검증
- `User` 데코레이터: 사용자 정보 추출
- `AuthContext`: 인증 및 사용자 관리 로직
- `UserService`: 사용자 비즈니스 규칙

## 마이그레이션 가이드

### 기존 user-service 사용자
1. 모든 사용자 관련 API 호출을 `auth-service`로 변경
2. Authorization 헤더를 사용하여 인증
3. URL 경로를 `/users/*`에서 `/auth/*`로 변경

### 예시
```javascript
// 기존
GET /users/123/profile

// 변경 후
GET /auth/me
Authorization: Bearer <token>
```

## 환경 변수

```env
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=auth_service
```

## 테스트

모든 엔드포인트는 Swagger UI를 통해 테스트할 수 있습니다:
- 개발 환경: `http://localhost:3000/api`

