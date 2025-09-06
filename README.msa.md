# Career Lens - Microservices Architecture

Career Lens를 마이크로서비스 아키텍처(MSA)로 구성한 프로젝트입니다.

## 🏗️ 아키텍처 개요

### 마이크로서비스 구성

- **User Service** (Port: 3001) - 사용자 관리 서비스
- **Auth Service** (Port: 3002) - 인증 및 권한 관리 서비스

### 데이터베이스 분리

- **User Service DB** (Port: 5432) - 사용자 정보 저장
- **Auth Service DB** (Port: 5433) - 인증 정보 저장

## 📁 프로젝트 구조

```
career-lens/
├── apps/
│   ├── user-service/          # 사용자 관리 마이크로서비스
│   │   ├── src/
│   │   │   ├── domain/        # 도메인 레이어
│   │   │   ├── context/       # 컨텍스트 레이어
│   │   │   ├── business/      # 비즈니스 레이어
│   │   │   ├── infrastructure/# 인프라 레이어
│   │   │   └── presentation/  # 프레젠테이션 레이어
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── auth-service/          # 인증 관리 마이크로서비스
│       ├── src/
│       │   ├── domain/        # 도메인 레이어
│       │   ├── context/       # 컨텍스트 레이어
│       │   ├── business/      # 비즈니스 레이어
│       │   ├── infrastructure/# 인프라 레이어
│       │   └── presentation/  # 프레젠테이션 레이어
│       ├── package.json
│       └── tsconfig.json
├── docker-compose.yml         # 프로덕션용 Docker Compose
├── docker-compose.dev.yml     # 개발용 Docker Compose
└── package.json               # 루트 패키지 (서비스 관리용)
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
# 모든 서비스의 의존성 설치
npm run install:all

# 개별 서비스 의존성 설치
npm run install:user
npm run install:auth
```

### 2. 개발 환경 실행

```bash
# Docker Compose로 개발 환경 실행
npm run docker:up:dev

# 또는 개별 서비스 실행
npm run start:dev:user
npm run start:dev:auth

# 모든 서비스 동시 실행
npm run start:dev
```

### 3. 프로덕션 환경 실행

```bash
# Docker Compose로 프로덕션 환경 실행
npm run docker:up

# 또는 빌드 후 실행
npm run build
npm start
```

## 🔗 서비스 엔드포인트

### User Service
- **Base URL**: `http://localhost:3001`
- **Swagger**: `http://localhost:3001/api`
- **Health Check**: `GET /health`

### Auth Service
- **Base URL**: `http://localhost:3002`
- **Swagger**: `http://localhost:3002/api`
- **Health Check**: `GET /health`

### 공통 인프라
- **pgAdmin**: `http://localhost:8080`
  - Email: `admin@career-lens.com`
  - Password: `admin123`

## 🗄️ 데이터베이스 구성

### User Service Database
- **Host**: `localhost:5432`
- **Database**: `user_service` (production) / `user_service_dev` (development)
- **Tables**: `users`

### Auth Service Database
- **Host**: `localhost:5433`
- **Database**: `auth_service` (production) / `auth_service_dev` (development)
- **Tables**: `users` (인증용 사용자 정보)

## 📝 주요 명령어

```bash
# 개발
npm run start:dev              # 모든 서비스 개발 모드 실행
npm run start:dev:user         # User Service만 개발 모드 실행
npm run start:dev:auth         # Auth Service만 개발 모드 실행

# 빌드
npm run build                  # 모든 서비스 빌드
npm run build:user             # User Service만 빌드
npm run build:auth             # Auth Service만 빌드

# Docker
npm run docker:up              # 프로덕션 환경 실행
npm run docker:up:dev          # 개발 환경 실행
npm run docker:down            # 프로덕션 환경 중지
npm run docker:down:dev        # 개발 환경 중지

# 테스트
npm run test                   # 모든 서비스 테스트
npm run test:user              # User Service 테스트
npm run test:auth              # Auth Service 테스트

# 코드 품질
npm run lint                   # 린트 실행
npm run format                 # 코드 포맷팅
```

## 🔧 환경 변수

각 서비스는 다음과 같은 환경 변수를 사용합니다:

### User Service
```env
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password123
DB_DATABASE=user_service_dev
```

### Auth Service
```env
NODE_ENV=development
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password123
DB_DATABASE=auth_service_dev
JWT_SECRET=your-dev-jwt-secret-key
```

## 🏛️ DDD 아키텍처

각 마이크로서비스는 Domain-Driven Design(DDD)의 3계층 아키텍처를 따릅니다:

1. **Domain Layer**: 순수한 비즈니스 로직과 엔티티
2. **Context Layer**: 도메인 객체들의 조합과 조정
3. **Business Layer**: 유스케이스와 애플리케이션 워크플로우

## 🔄 서비스 간 통신

현재는 각 서비스가 독립적으로 동작하며, 필요시 HTTP API를 통해 통신할 수 있도록 설계되었습니다.

추후 확장 시 다음과 같은 통신 방식을 고려할 수 있습니다:
- REST API
- GraphQL Federation
- Message Queue (RabbitMQ, Apache Kafka)
- gRPC

## 📊 모니터링 및 로깅

- 각 서비스는 독립적인 로그를 생성합니다
- Docker 환경에서는 `./logs` 디렉토리에 로그가 저장됩니다
- 추후 ELK Stack이나 Prometheus + Grafana를 통한 모니터링 시스템 구축 가능

## 🔐 보안 고려사항

- 각 서비스는 독립적인 데이터베이스를 가집니다
- JWT 기반 인증 시스템
- API 간 통신 시 인증 토큰 검증
- 환경별 시크릿 관리

## 🚧 향후 확장 계획

1. **API Gateway** 도입
2. **Service Discovery** 구현
3. **Circuit Breaker** 패턴 적용
4. **분산 트레이싱** 시스템 구축
5. **CI/CD 파이프라인** 구성
6. **Kubernetes** 배포 환경 구성
