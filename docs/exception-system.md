# 예외 처리 시스템 (Exception System)

## 개요

도메인 중심의 예외 처리 시스템을 구현하여 일관된 에러 핸들링과 명확한 에러 코드를 제공합니다.

## 아키텍처

### DomainException 기본 클래스

모든 도메인 예외는 `DomainException`을 상속받아야 합니다.

```typescript
export abstract class DomainException extends Error {
  abstract readonly code: string;

  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }
}
```

### 특징

1. **추상 클래스**: 직접 인스턴스화할 수 없음
2. **에러 코드**: 각 예외마다 고유한 코드 제공
3. **스택 트레이스**: 최적화된 스택 트레이스 제공
4. **JSON 직렬화**: API 응답을 위한 JSON 변환 지원

## 예외 분류

### 인증 관련 예외 (Auth Exceptions)

#### EmailAlreadyExistsException
- **코드**: `EMAIL_ALREADY_EXISTS`
- **용도**: 회원가입 시 이메일 중복
- **사용 예시**:
```typescript
throw new EmailAlreadyExistsException("user@example.com");
```

#### InvalidCredentialsException
- **코드**: `INVALID_CREDENTIALS`
- **용도**: 로그인 시 잘못된 이메일/비밀번호
- **사용 예시**:
```typescript
throw new InvalidCredentialsException();
```

#### InvalidTokenException
- **코드**: `INVALID_TOKEN`
- **용도**: JWT 토큰 검증 실패
- **사용 예시**:
```typescript
throw new InvalidTokenException("Token has expired");
```

### 사용자 관련 예외 (User Exceptions)

#### UserNotFoundException
- **코드**: `USER_NOT_FOUND`
- **용도**: 존재하지 않는 사용자 조회
- **사용 예시**:
```typescript
throw new UserNotFoundException("user-id-123");
```

#### UserValidationException
- **코드**: `USER_VALIDATION_ERROR`
- **용도**: 사용자 데이터 검증 실패
- **사용 예시**:
```typescript
throw new UserValidationException("이름은 필수입니다");
```

#### PasswordChangeNotAllowedException
- **코드**: `PASSWORD_CHANGE_NOT_ALLOWED`
- **용도**: 소셜 로그인 사용자의 비밀번호 변경 시도
- **사용 예시**:
```typescript
throw new PasswordChangeNotAllowedException("kakao");
```

#### InvalidPasswordException
- **코드**: `INVALID_PASSWORD`
- **용도**: 비밀번호 정책 위반
- **사용 예시**:
```typescript
throw new InvalidPasswordException("비밀번호는 최소 6자 이상이어야 합니다");
```

## 사용법

### 1. 예외 발생
```typescript
// 인증 컨텍스트에서
if (!user) {
  throw new UserNotFoundException(userId);
}

// 사용자 서비스에서
if (!this.canChangePassword(user)) {
  throw new PasswordChangeNotAllowedException(user.signType);
}
```

### 2. 예외 처리
```typescript
try {
  await this.authContext.login(loginRequest);
} catch (error) {
  if (error instanceof InvalidCredentialsException) {
    // 로그인 실패 처리
  } else if (error instanceof UserNotFoundException) {
    // 사용자 없음 처리
  }
}
```

### 3. API 응답
```typescript
// DomainExceptionFilter에서 자동으로 처리
{
  "statusCode": 400,
  "error": {
    "name": "UserNotFoundException",
    "code": "USER_NOT_FOUND",
    "message": "User with id 123 not found"
  },
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/auth/me"
}
```

## 파일 구조

```
src/domain/
├── common/
│   └── exceptions/
│       ├── domain.exception.ts    # 기본 예외 클래스
│       └── index.ts              # 내보내기
├── auth/
│   └── exceptions/
│       ├── auth.exceptions.ts    # 인증 관련 예외
│       └── index.ts              # 내보내기
└── user/
    └── exceptions/
        ├── user.exceptions.ts    # 사용자 관련 예외
        └── index.ts              # 내보내기
```

## 확장 가이드

### 새로운 예외 추가

1. **도메인별 예외 파일에 추가**:
```typescript
export class NewDomainException extends DomainException {
  readonly code = "NEW_DOMAIN_ERROR";
  
  constructor(message: string) {
    super(message);
  }
}
```

2. **index.ts에 내보내기 추가**:
```typescript
export * from "./new-domain.exceptions";
```

3. **사용처에서 import**:
```typescript
import { NewDomainException } from "../../domain/new-domain/exceptions";
```

### 예외 코드 규칙

- **형식**: `UPPER_SNAKE_CASE`
- **구조**: `DOMAIN_ACTION_TYPE`
- **예시**: `USER_NOT_FOUND`, `AUTH_INVALID_TOKEN`

## 테스트

```typescript
describe('UserNotFoundException', () => {
  it('should create exception with correct properties', () => {
    const userId = 'test-id';
    const exception = new UserNotFoundException(userId);
    
    expect(exception.code).toBe('USER_NOT_FOUND');
    expect(exception.message).toBe(`User with id ${userId} not found`);
    expect(exception.name).toBe('UserNotFoundException');
  });
});
```

## 모범 사례

1. **명확한 메시지**: 사용자에게 이해하기 쉬운 메시지 제공
2. **고유한 코드**: 각 예외마다 고유한 에러 코드 사용
3. **도메인 중심**: 비즈니스 로직에 맞는 예외 분류
4. **일관성**: 동일한 패턴으로 예외 정의
5. **테스트**: 모든 예외에 대한 단위 테스트 작성
