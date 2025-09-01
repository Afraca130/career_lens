# Mountain - 3계층 아키텍처 기반 인증 시스템

Clean Architecture 원칙을 적용한 3계층 아키텍처로 구성된 인증 및 사용자 관리 시스템입니다.

## 🏗️ 아키텍처

- **Domain Layer**: 핵심 비즈니스 로직과 규칙
- **Context Layer**: 비즈니스 로직 조정 및 도메인 간 협력
- **Business Layer**: 애플리케이션 유스케이스 구현
- **Presentation Layer**: API 엔드포인트 및 DTO

## 🚀 주요 기능

### 회원가입

- 이메일 중복 검증
- 비밀번호 암호화 (bcrypt)
- 사용자 및 인증 정보 생성

### 로그인

- 이메일 존재 여부 확인
- 비밀번호 검증
- JWT 액세스 토큰 생성

## 🛠️ 기술 스택

- **Framework**: NestJS
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI

## 📦 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

```bash
cp env.example .env
# .env 파일을 편집하여 실제 값으로 설정
```

### 3. MongoDB 실행

```bash
# MongoDB가 실행 중인지 확인
mongod
```

### 4. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod
```

## 📚 API 문서

애플리케이션 실행 후 다음 URL에서 Swagger 문서를 확인할 수 있습니다:

- http://localhost:3000/api

## 🧪 테스트

```bash
# 단위 테스트
npm run test

# E2E 테스트
npm run test:e2e

# 테스트 커버리지
npm run test:cov
```

## 📁 프로젝트 구조

```
src/
├── domain/           # 도메인 레이어
├── context/          # 컨텍스트 레이어
├── business/         # 비즈니스 레이어
├── presentation/     # 프레젠테이션 레이어
└── infrastructure/   # 인프라스트럭처 레이어
```

## 🔐 보안

- bcrypt를 사용한 비밀번호 해싱 (Salt Rounds: 10)
- JWT 토큰 기반 인증 (24시간 유효)
- 입력 데이터 검증 및 sanitization
- 소프트 삭제를 통한 데이터 보호
