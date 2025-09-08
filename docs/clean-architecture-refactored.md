# Clean Architecture 리팩토링 완료

## 개요

Clean Architecture 원칙에 따라 불필요한 파일들을 제거하고, 공통 기능들을 적절한 위치로 이동시켜 더욱 깔끔한 구조로 리팩토링했습니다.

## 제거된 불필요한 파일들

### 1. 기존 레이어 제거
- ❌ `src/business/` - 기존 비즈니스 레이어 (유스케이스로 대체)
- ❌ `src/context/` - 기존 컨텍스트 레이어 (유스케이스로 대체)
- ❌ `src/domain/user/entity/user.entity.ts` - TypeORM 의존성이 있는 기존 엔티티
- ❌ `src/domain/user/user-domain.module.ts` - 불필요한 도메인 모듈

### 2. Infrastructure에서 제거된 공통 기능들
- ❌ `src/infrastructure/interceptors/` - Shared로 이동
- ❌ `src/infrastructure/filters/` - Shared로 이동  
- ❌ `src/infrastructure/guards/` - Shared로 이동
- ❌ `src/infrastructure/decorators/` - Shared로 이동

## 새로운 구조

### 📁 최종 디렉토리 구조
```
src/
├── domain/                    # 도메인 레이어 (핵심 비즈니스 로직)
│   ├── auth/
│   │   ├── auth.service.interface.ts
│   │   └── exceptions/
│   ├── common/
│   │   └── exceptions/
│   └── user/
│       ├── entity/
│       │   └── user.domain.ts    # 순수 도메인 엔티티
│       ├── exceptions/
│       ├── user.repository.interface.ts
│       └── user.service.interface.ts
├── application/               # 애플리케이션 레이어 (유스케이스)
│   ├── application.module.ts
│   ├── services/
│   │   └── auth.application.service.ts
│   └── use-cases/
│       ├── auth/
│       └── user/
├── infrastructure/           # 인프라스트럭처 레이어 (외부 시스템)
│   ├── infrastructure.module.ts
│   ├── persistence/
│   │   ├── mappers/
│   │   └── typeorm/
│   ├── repositories/
│   └── services/
├── presentation/             # 프레젠테이션 레이어 (API)
│   └── auth/
│       ├── auth.controller.ts
│       ├── auth.module.ts
│       └── dto/
└── shared/                   # 공통 기능 (새로 추가)
    ├── shared.module.ts
    ├── decorators/
    ├── filters/
    ├── guards/
    └── interceptors/
```

## Shared 모듈의 역할

### 🎯 공통 기능 중앙화
`src/shared/` 디렉토리는 여러 레이어에서 공통으로 사용되는 기능들을 관리합니다:

#### 1. Interceptors
- `logging.interceptor.ts`: HTTP 요청/응답 로깅

#### 2. Filters  
- `domain-exception.filter.ts`: 도메인 예외를 HTTP 응답으로 변환

#### 3. Guards
- `jwt-auth.guard.ts`: JWT 토큰 검증 및 사용자 정보 추출

#### 4. Decorators
- `user.decorator.ts`: JWT에서 사용자 정보 추출하는 데코레이터

### 📦 SharedModule
```typescript
@Module({
  imports: [JwtModule.register({...})],
  providers: [
    LoggingInterceptor,
    DomainExceptionFilter, 
    JwtAuthGuard,
  ],
  exports: [
    LoggingInterceptor,
    DomainExceptionFilter,
    JwtAuthGuard,
    JwtModule,
  ],
})
export class SharedModule {}
```

## 모듈 의존성 구조

### 🔄 의존성 방향
```
Presentation Layer
       ↓
Application Layer ← Shared Module
       ↓
Infrastructure Layer
       ↑
Domain Layer
```

### 📋 모듈 구성

#### 1. AppModule (루트)
```typescript
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({...}),
    AuthModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },
    { provide: APP_FILTER, useClass: DomainExceptionFilter },
  ],
})
export class AppModule {}
```

#### 2. AuthModule (Presentation)
```typescript
@Module({
  imports: [ApplicationModule, SharedModule],
  controllers: [AuthController],
})
export class AuthModule {}
```

#### 3. ApplicationModule
```typescript
@Module({
  imports: [InfrastructureModule, SharedModule],
  providers: [
    AuthApplicationService,
    SignupUseCase,
    LoginUseCase,
    // ... 기타 유스케이스들
  ],
  exports: [AuthApplicationService],
})
export class ApplicationModule {}
```

#### 4. InfrastructureModule
```typescript
@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [
    UserRepository,
    AuthService,
    UserService,
  ],
  exports: [
    UserRepository,
    AuthService, 
    UserService,
  ],
})
export class InfrastructureModule {}
```

## 개선된 점

### ✅ 1. 명확한 책임 분리
- **Domain**: 순수 비즈니스 로직만 포함
- **Application**: 유스케이스와 애플리케이션 서비스
- **Infrastructure**: 데이터베이스, 외부 서비스 구현
- **Presentation**: HTTP API 처리
- **Shared**: 공통 기능 중앙화

### ✅ 2. 의존성 정리
- 도메인 레이어는 외부 의존성 없음
- 공통 기능들이 적절한 위치에 배치
- 모듈 간 의존성이 명확하게 정의됨

### ✅ 3. 재사용성 향상
- Shared 모듈을 통한 공통 기능 재사용
- 인터페이스를 통한 구현체 교체 가능
- 유스케이스 단위의 독립적 테스트 가능

### ✅ 4. 유지보수성 개선
- 불필요한 파일들 제거로 구조 단순화
- 각 레이어의 역할이 명확해짐
- 변경 시 영향 범위 최소화

## 사용법

### 1. 새로운 유스케이스 추가
```typescript
// 1. use-cases/에 유스케이스 생성
export class NewUseCase {
  async execute(request: NewRequest): Promise<NewResponse> {
    // 비즈니스 로직
  }
}

// 2. ApplicationModule에 등록
providers: [NewUseCase]

// 3. ApplicationService에서 사용
async newFeature(request: NewRequest): Promise<NewResponse> {
  return this.newUseCase.execute(request);
}
```

### 2. 새로운 공통 기능 추가
```typescript
// 1. shared/에 기능 추가
export class NewSharedService {
  // 공통 로직
}

// 2. SharedModule에 등록
providers: [NewSharedService]
exports: [NewSharedService]

// 3. 필요한 모듈에서 사용
imports: [SharedModule]
```

### 3. 새로운 도메인 예외 추가
```typescript
// 1. domain/exceptions/에 예외 정의
export class NewDomainException extends DomainException {
  readonly code = "NEW_DOMAIN_ERROR";
}

// 2. DomainExceptionFilter에 매핑 추가
if (exception instanceof NewDomainException) {
  return { status: HttpStatus.BAD_REQUEST, message: "..." };
}
```

## 테스트 전략

### 1. 도메인 레이어
- 순수한 단위 테스트
- 외부 의존성 없음
- 비즈니스 규칙 검증

### 2. 애플리케이션 레이어  
- 유스케이스 단위 테스트
- 도메인 인터페이스 모킹
- 통합 테스트 가능

### 3. 인프라스트럭처 레이어
- 실제 데이터베이스 사용
- 외부 서비스 통합 테스트

### 4. 프레젠테이션 레이어
- 컨트롤러 단위 테스트
- E2E 테스트

이제 Clean Architecture 원칙에 완전히 부합하는 깔끔하고 유지보수 가능한 구조를 갖추었습니다.
