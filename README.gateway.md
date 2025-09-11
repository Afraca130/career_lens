# API Gateway 설정 및 gRPC 통신

## 개요

Career Lens 프로젝트에 API 게이트웨이를 추가하여 gRPC 통신을 통해 마이크로서비스 간 통신을 구현했습니다.

## 아키텍처

```
┌─────────────────┐    HTTP     ┌─────────────────┐    gRPC     ┌─────────────────┐
│   API Gateway   │ ──────────► │  User Service   │ ──────────► │   PostgreSQL    │
│   (Port: 3000)  │             │ (Port: 3001)    │             │   (Port: 5432)  │
│                 │             │ gRPC: 50051     │             │                 │
└─────────────────┘             └─────────────────┘             └─────────────────┘
```

## 서비스 구성

### 1. API Gateway (`apps/api-gateway`)

- **포트**: 3000 (HTTP)
- **역할**:
  - 클라이언트 요청을 받아서 적절한 마이크로서비스로 라우팅
  - gRPC 클라이언트를 통해 User Service와 통신
  - 인증 및 권한 관리
  - API 문서화 (Swagger)

### 2. User Service (`apps/user-service`)

- **포트**: 3001 (HTTP), 50051 (gRPC)
- **역할**:
  - 사용자 인증 및 관리
  - gRPC 서버로 API Gateway와 통신
  - 데이터베이스 직접 접근

## API 엔드포인트

### 인증 관련

- `POST /users/signup` - 회원가입
- `POST /users/login` - 로그인
- `POST /users/verify-token` - 토큰 검증
- `POST /users/refresh-token` - 토큰 갱신

### 사용자 관리

- `GET /users/me` - 내 정보 조회
- `PUT /users/change-password` - 비밀번호 변경
- `PUT /users/profile` - 프로필 업데이트
- `DELETE /users/:id` - 사용자 삭제
- `GET /users` - 사용자 목록 조회

### 헬스 체크

- `GET /health` - 서비스 상태 확인
- `GET /health/ready` - 레디니스 체크

## 실행 방법

### 개발 환경

```bash
# 개발용 Docker Compose 실행
docker-compose -f docker-compose.dev.yml up --build

# 또는 개별 서비스 실행
cd apps/api-gateway
npm install
npm run start:dev

cd apps/user-service
npm install
npm run start:dev
```

### 프로덕션 환경

```bash
# 프로덕션용 Docker Compose 실행
docker-compose up --build
```

## 환경 변수

### API Gateway

- `PORT`: API Gateway 포트 (기본값: 3000)
- `USER_SERVICE_GRPC_URL`: User Service gRPC URL (기본값: localhost:50051)

### User Service

- `PORT`: HTTP 포트 (기본값: 3001)
- `GRPC_URL`: gRPC 포트 (기본값: 0.0.0.0:50051)
- `DB_HOST`: 데이터베이스 호스트
- `DB_PORT`: 데이터베이스 포트
- `DB_USERNAME`: 데이터베이스 사용자명
- `DB_PASSWORD`: 데이터베이스 비밀번호
- `DB_DATABASE`: 데이터베이스 이름
- `JWT_SECRET`: JWT 시크릿 키

## 테스트

### 1. 서비스 상태 확인

```bash
# API Gateway 헬스 체크
curl http://localhost:3000/health

# User Service 직접 접근 (개발용)
curl http://localhost:3001/health
```

### 2. 회원가입 테스트

```bash
curl -X POST http://localhost:3000/users/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "홍길동",
    "email": "test@example.com",
    "password": "password123",
    "signType": "email"
  }'
```

### 3. 로그인 테스트

```bash
curl -X POST http://localhost:3000/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 4. 인증이 필요한 API 테스트

```bash
# 로그인 후 받은 토큰을 사용
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Swagger 문서

API 문서는 다음 URL에서 확인할 수 있습니다:

- API Gateway: http://localhost:3000/api
- User Service (직접 접근): http://localhost:3001/api

## gRPC 통신 흐름

1. 클라이언트가 API Gateway에 HTTP 요청
2. API Gateway가 인증이 필요한 경우 User Service에 토큰 검증 요청 (gRPC)
3. User Service가 토큰을 검증하고 결과 반환 (gRPC)
4. API Gateway가 비즈니스 로직 요청을 User Service에 전달 (gRPC)
5. User Service가 데이터베이스에서 데이터 처리 후 결과 반환 (gRPC)
6. API Gateway가 클라이언트에게 HTTP 응답 반환

## 문제 해결

### gRPC 연결 오류

- proto 파일이 올바른 위치에 있는지 확인
- gRPC 포트가 열려있는지 확인
- 서비스 간 네트워크 연결 확인

### 인증 오류

- JWT_SECRET이 동일한지 확인
- 토큰 형식이 올바른지 확인 (Bearer 토큰)

### 데이터베이스 연결 오류

- 데이터베이스 서비스가 실행 중인지 확인
- 연결 정보가 올바른지 확인
- 데이터베이스가 초기화되었는지 확인
