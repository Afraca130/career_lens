# Clean Architecture 구현 가이드

## 개요

Clean Architecture 원칙에 따라 인증 서비스를 재구성하여 도메인 중심의 아키텍처를 구현했습니다.

## 아키텍처 레이어

### 1. 도메인 레이어 (Domain Layer)
**위치**: `src/domain/`

도메인의 핵심 비즈니스 로직과 규칙을 포함하는 가장 안쪽 레이어입니다.

#### 구성 요소
- **엔티티**: `user/entity/user.domain.ts`
  - 순수한 비즈니스 로직을 포함하는 도메인 객체
  - 외부 의존성 없음 (TypeORM, 프레임워크 등)
  - 불변성과 캡슐화 원칙 적용

- **인터페이스**: 
  - `user/user.repository.interface.ts`: 데이터 저장소 추상화
  - `user/user.service.interface.ts`: 사용자 비즈니스 규칙 추상화
  - `auth/auth.service.interface.ts`: 인증 서비스 추상화

- **예외**: `common/exceptions/`, `user/exceptions/`, `auth/exceptions/`
  - 도메인별 예외 정의
  - 비즈니스 규칙 위반 시 발생

#### 특징
- 외부 의존성 없음
- 프레임워크 독립적
- 테스트하기 쉬움
- 비즈니스 규칙의 단일 진실 공급원

### 2. 애플리케이션 레이어 (Application Layer)
**위치**: `src/application/`

유스케이스와 애플리케이션 서비스를 포함하는 레이어입니다.

#### 구성 요소
- **유스케이스**: `use-cases/`
  - `auth/signup.use-case.ts`: 회원가입 유스케이스
  - `auth/login.use-case.ts`: 로그인 유스케이스
  - `auth/verify-token.use-case.ts`: 토큰 검증 유스케이스
  - `user/get-user.use-case.ts`: 사용자 조회 유스케이스
  - `user/change-password.use-case.ts`: 비밀번호 변경 유스케이스

- **요청/응답 DTO**: `use-cases/*/request.ts`, `use-cases/*/response.ts`
  - 유스케이스 간 데이터 전달 객체
  - 도메인 객체와 분리된 데이터 구조

- **애플리케이션 서비스**: `services/auth.application.service.ts`
  - 유스케이스들을 조합하여 애플리케이션 레벨 로직 처리

#### 특징
- 도메인 레이어에만 의존
- 유스케이스 단위로 비즈니스 로직 캡슐화
- 프레젠테이션 레이어와 도메인 레이어 사이의 중재자 역할

### 3. 인프라스트럭처 레이어 (Infrastructure Layer)
**위치**: `src/infrastructure/`

외부 시스템과의 통신을 담당하는 레이어입니다.

#### 구성 요소
- **데이터베이스**: `persistence/`
  - `typeorm/user.entity.ts`: TypeORM 엔티티
  - `mappers/user.mapper.ts`: 도메인 객체와 엔티티 간 매핑

- **리포지토리 구현**: `repositories/user.repository.ts`
  - 도메인 인터페이스를 구현한 데이터 저장소

- **서비스 구현**: `services/`
  - `auth.service.ts`: JWT 토큰 처리
  - `user.service.ts`: 사용자 비즈니스 규칙 구현

- **가드**: `guards/jwt-auth.guard.ts`
  - JWT 인증 처리

#### 특징
- 도메인 레이어에 의존
- 외부 시스템과의 통신 담당
- 프레임워크별 구현 세부사항 포함

### 4. 프레젠테이션 레이어 (Presentation Layer)
**위치**: `src/presentation/`

외부와의 인터페이스를 담당하는 레이어입니다.

#### 구성 요소
- **컨트롤러**: `auth/auth.controller.ts`
  - HTTP 요청/응답 처리
  - DTO 변환 및 유스케이스 호출

- **DTO**: `auth/dto/`
  - API 요청/응답 데이터 구조

#### 특징
- 애플리케이션 레이어에만 의존
- HTTP 프로토콜과 관련된 세부사항 처리
- 도메인 로직과 분리

## 의존성 방향

```
Presentation Layer
       ↓
Application Layer
       ↓
Domain Layer
       ↑
Infrastructure Layer
```

### 의존성 규칙
1. **내부 레이어는 외부 레이어를 알지 못함**
2. **외부 레이어는 내부 레이어의 인터페이스에 의존**
3. **도메인 레이어는 어떤 외부 의존성도 가질 수 없음**

## 모듈 구조

### 1. ApplicationModule
```typescript
@Module({
  imports: [InfrastructureModule],
  providers: [
    AuthApplicationService,
    SignupUseCase,
    LoginUseCase,
    VerifyTokenUseCase,
    GetUserUseCase,
    ChangePasswordUseCase,
  ],
  exports: [AuthApplicationService],
})
export class ApplicationModule {}
```

### 2. InfrastructureModule
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({...}),
  ],
  providers: [
    UserRepository,
    AuthService,
    UserService,
    JwtAuthGuard,
  ],
  exports: [...],
})
export class InfrastructureModule {}
```

### 3. AuthModule (Presentation)
```typescript
@Module({
  imports: [ApplicationModule],
  controllers: [AuthController],
})
export class AuthModule {}
```

## 데이터 흐름

### 1. 회원가입 흐름
```
Controller → ApplicationService → SignupUseCase → UserRepository → Database
                ↓
            Domain.User (비즈니스 로직)
```

### 2. 로그인 흐름
```
Controller → ApplicationService → LoginUseCase → UserRepository + AuthService
                ↓
            Domain.User + JWT Token
```

## 매핑 전략

### 도메인 ↔ 인프라스트럭처 매핑
```typescript
// UserMapper를 통한 변환
const domainUser = UserMapper.toDomain(entity);
const entity = UserMapper.toEntity(domainUser);
```

### DTO ↔ 도메인 매핑
```typescript
// 컨트롤러에서 요청 객체 생성
const request = new SignupRequest(
  signupDto.name,
  signupDto.email,
  signupDto.password,
  signupDto.signType
);
```

## 테스트 전략

### 1. 도메인 레이어 테스트
- 순수한 단위 테스트
- 외부 의존성 없음
- 비즈니스 규칙 검증

### 2. 애플리케이션 레이어 테스트
- 유스케이스 단위 테스트
- 도메인 인터페이스 모킹
- 통합 테스트 가능

### 3. 인프라스트럭처 레이어 테스트
- 실제 데이터베이스 사용
- 외부 서비스 통합 테스트

## 장점

### 1. 유지보수성
- 각 레이어의 책임이 명확히 분리
- 변경 시 영향 범위 최소화

### 2. 테스트 용이성
- 도메인 로직의 독립적 테스트 가능
- 의존성 주입을 통한 모킹 용이

### 3. 확장성
- 새로운 유스케이스 추가 용이
- 외부 시스템 변경에 유연한 대응

### 4. 프레임워크 독립성
- 도메인 로직이 프레임워크에 의존하지 않음
- 기술 스택 변경 시 도메인 로직 보존

## 마이그레이션 가이드

### 기존 코드에서 Clean Architecture로 전환

1. **도메인 엔티티 분리**
   - TypeORM 데코레이터 제거
   - 순수한 비즈니스 로직만 포함

2. **유스케이스 추출**
   - 기존 서비스 로직을 유스케이스로 분리
   - 단일 책임 원칙 적용

3. **의존성 역전**
   - 인터페이스 정의
   - 구현체를 인프라스트럭처로 이동

4. **모듈 재구성**
   - 레이어별 모듈 분리
   - 의존성 방향 정리

## 모범 사례

### 1. 도메인 엔티티
```typescript
export class User {
  // 불변성 유지
  updatePassword(newPassword: string): User {
    return new User(/* ... */);
  }
  
  // 비즈니스 규칙 캡슐화
  canChangePassword(): boolean {
    return this.signType === "email";
  }
}
```

### 2. 유스케이스
```typescript
export class SignupUseCase {
  async execute(request: SignupRequest): Promise<SignupResponse> {
    // 1. 비즈니스 규칙 검증
    // 2. 도메인 객체 생성
    // 3. 저장소에 저장
    // 4. 응답 생성
  }
}
```

### 3. 매퍼
```typescript
export class UserMapper {
  static toDomain(entity: UserEntity): User {
    // 엔티티를 도메인 객체로 변환
  }
  
  static toEntity(domain: User): UserEntity {
    // 도메인 객체를 엔티티로 변환
  }
}
```

이 Clean Architecture 구현을 통해 유지보수 가능하고 테스트하기 쉬운 코드베이스를 구축했습니다.
