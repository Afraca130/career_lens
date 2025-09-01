# Three-Layer Architecture: Domain, Context, Business

새로운 3계층 아키텍처로 재구성된 인증 및 사용자 관리 시스템입니다.

## 🏗️ **아키텍처 개요**

```
src/
├── domain/                    # 도메인 레이어 (핵심 비즈니스 로직)
│   ├── auth/                 # 인증 도메인
│   │   ├── auth.domain.ts
│   │   └── auth-domain-module.ts
│   └── user/                 # 사용자 도메인
│       ├── entity    # 사용자 엔티티
│       |   └── user.entity.ts    # 사용자 엔티티
│       ├── user.domain.ts
│       └── user-domain.module.ts
├── context/                  # 컨텍스트 레이어 (비즈니스 로직 조정)
│   ├── auth/                 # 인증 컨텍스트
│   |   ├── auth-context.module.ts
│   │   └── auth.context.ts   # 인증 관련 비즈니스 로직 조정
│   └── user/                 # 사용자 컨텍스트
│       ├── user-context.module.ts
│       └── user.context.ts   # 사용자 관련 비즈니스 로직 조정
├── business/                 # 비즈니스 레이어 (유스케이스)
│   ├── auth/                 # 인증 유스케이스
│   |   ├── auth-business.module.ts
│   │   └── auth.business.ts
│   └── user/                 # 사용자 유스케이스
└── presentation/             # 프레젠테이션 레이어
    ├── auth/                 # 인증 컨트롤러
    │   ├── auth.controller.ts
    │   └── dto/
    └── user/                 # 사용자 컨트롤러
        ├── user.controller.ts
        └── dto/
```

## 🔄 **계층별 역할**

### 1. **Domain Layer (도메인 레이어)**

- **목적**: 핵심 비즈니스 로직과 규칙을 정의
- **구성요소**:
  - **Entities**: 비즈니스 객체 (User, Auth)
  - **Repository Interfaces**: 데이터 접근 계약
  - **Service Interfaces**: 비즈니스 서비스 계약
- **특징**: 프레임워크 독립적, 순수 TypeScript

### 2. **Context Layer (컨텍스트 레이어)**

- **목적**: 비즈니스 로직 조정 및 도메인 간 협력
- **구성요소**:
  - **AuthContext**: 인증 관련 비즈니스 로직 조정
  - **UserContext**: 사용자 관련 비즈니스 로직 조정
- **특징**: 도메인 객체들을 조합하여 복잡한 비즈니스 로직 처리

### 3. **Business Layer (비즈니스 레이어)**

- **목적**: 애플리케이션 유스케이스 구현
- **구성요소**:
  - **SignupUseCase**: 회원가입 유스케이스
  - **LoginUseCase**: 로그인 유스케이스
- **특징**: 컨텍스트를 사용하여 비즈니스 로직 실행

## 🚀 **주요 기능**

### **회원가입 (Signup)**

```typescript
POST /auth/signup
{
  "email": "user@example.com",
  "password": "password123",
  "name": "홍길동",
  "signType": "email" // optional, default: "email"
}
```

**처리 과정:**

1. 이메일 중복 검증
2. 비밀번호 암호화 (bcrypt)
3. 사용자 및 인증 정보 생성
4. MongoDB에 저장

### **로그인 (Login)**

```typescript
POST /auth/login
{
  "email": "user@example.com",
  "password": "password123"
}
```

**처리 과정:**

1. 이메일 존재 여부 확인
2. 비밀번호 검증 (bcrypt.compare)
3. JWT 액세스 토큰 생성
4. 사용자 정보와 토큰 반환

### **사용자 관리**

- `GET /users/:id` - 사용자 정보 조회
- `PUT /users/:id/name` - 사용자 이름 수정
- `DELETE /users/:id` - 사용자 삭제 (소프트 삭제)

## 🔐 **보안 기능**

### **비밀번호 보안**

- **bcrypt**를 사용한 비밀번호 해싱
- **Salt Rounds**: 10 (권장값)
- **비밀번호 검증**: 해시된 비밀번호와 평문 비교

### **JWT 토큰**

- **액세스 토큰**: 24시간 유효
- **시크릿 키**: 환경변수 `JWT_SECRET` 사용
- **페이로드**: 사용자 ID, 이메일, 토큰 타입

### **데이터 보안**

- **소프트 삭제**: `isDeleted` 플래그 사용
- **이메일 검증**: 중복 이메일 방지
- **입력 검증**: class-validator를 통한 DTO 검증

## 📊 **데이터베이스 스키마**

### **User Collection**

```typescript
{
  _id: ObjectId,
  name: string,           // 사용자 이름
  email: string,          // 이메일 (unique)
  role: string,           // 사용자 역할 (default: 'user')
  isDeleted: boolean,     // 삭제 여부 (default: false)
  createdAt: Date,        // 생성 시간
  updatedAt: Date         // 수정 시간
}
```

### **Auth Collection**

```typescript
{
  _id: ObjectId,
  email: string,          // 이메일 (unique)
  password: string,       // 해시된 비밀번호
  signType: string,       // 가입 방식 (email, google, kakao)
  userId: ObjectId,       // User 참조
  isVerified: boolean,    // 이메일 인증 여부
  isDeleted: boolean,     // 삭제 여부
  createdAt: Date,        // 생성 시간
  updatedAt: Date         // 수정 시간
}
```

## 🛠️ **기술 스택**

- **Framework**: NestJS
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + bcrypt
- **Validation**: class-validator + class-transformer
- **Documentation**: Swagger/OpenAPI
- **Architecture**: Clean Architecture (3-Layer)

## 📝 **사용 방법**

### 1. **모듈 등록**

```typescript
import { AuthModule } from "./modules/auth.module";
import { UserModule } from "./modules/user.module";

@Module({
  imports: [AuthModule, UserModule],
})
export class AppModule {}
```

### 2. **환경 변수 설정**

```env
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/your-database
```

### 3. **API 테스트**

```bash
# 회원가입
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"테스트"}'

# 로그인
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔍 **에러 처리**

### **도메인 예외**

- **이메일 중복**: 409 Conflict
- **사용자 없음**: 404 Not Found
- **잘못된 비밀번호**: 401 Unauthorized
- **검증 실패**: 400 Bad Request

### **예외 필터**

- `AuthExceptionFilter`: 인증 관련 예외를 HTTP 응답으로 변환
- 적절한 HTTP 상태 코드와 에러 메시지 제공

## 🧪 **테스트 전략**

### **단위 테스트**

- **Domain Layer**: 비즈니스 규칙 검증
- **Context Layer**: 비즈니스 로직 조정 검증
- **Business Layer**: 유스케이스 실행 검증

### **통합 테스트**

- **Repository**: MongoDB 연동 검증
- **Service**: JWT 및 bcrypt 기능 검증

### **E2E 테스트**

- **API Endpoints**: 전체 워크플로우 검증

## 🚀 **향후 확장 계획**

1. **소셜 로그인**: Google, Kakao OAuth 연동
2. **이메일 인증**: 이메일 인증 시스템
3. **비밀번호 재설정**: 비밀번호 찾기 기능
4. **역할 기반 접근 제어**: RBAC 시스템
5. **감사 로그**: 사용자 활동 추적
6. **Rate Limiting**: API 요청 제한
7. **2FA**: 2단계 인증

## 📚 **참고 자료**

- [NestJS 공식 문서](https://docs.nestjs.com/)
- [MongoDB 공식 문서](https://docs.mongodb.com/)
- [JWT 공식 문서](https://jwt.io/)
- [bcrypt 공식 문서](https://github.com/dcodeIO/bcrypt.js/)
- [Clean Architecture 원칙](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
