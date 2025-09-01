# Docker 사용 가이드

## 🐳 Docker 환경 설정

### 프로덕션 환경

```bash
# 이미지 빌드 및 실행
docker-compose up -d

# 로그 확인
docker-compose logs -f app

# 서비스 중지
docker-compose down
```

### 개발 환경 (핫 리로드)

```bash
# 개발 환경 실행
docker-compose -f docker-compose.dev.yml up -d

# 로그 확인
docker-compose -f docker-compose.dev.yml logs -f app

# 서비스 중지
docker-compose -f docker-compose.dev.yml down
```

## 📋 서비스 구성

### 기본 서비스

- **app**: NestJS 애플리케이션 (포트: 3000)
- **postgres**: PostgreSQL 데이터베이스 (포트: 5432)

### 개발 전용 서비스

- **pgadmin**: PostgreSQL 웹 관리도구 (포트: 8080)
  - 접속: http://localhost:8080
  - 계정: admin@career-lens.com / admin123

## 🔧 환경변수

### 프로덕션

- `DB_HOST`: PostgreSQL 호스트
- `DB_PORT`: PostgreSQL 포트
- `DB_USERNAME`: PostgreSQL 사용자명
- `DB_PASSWORD`: PostgreSQL 비밀번호
- `DB_DATABASE`: PostgreSQL 데이터베이스명
- `JWT_SECRET`: JWT 시크릿 키
- `NODE_ENV`: production

### 개발

- `DB_HOST`: 개발용 PostgreSQL 호스트
- `DB_PORT`: 개발용 PostgreSQL 포트
- `DB_USERNAME`: 개발용 PostgreSQL 사용자명
- `DB_PASSWORD`: 개발용 PostgreSQL 비밀번호
- `DB_DATABASE`: 개발용 PostgreSQL 데이터베이스명
- `JWT_SECRET`: 개발용 JWT 시크릿 키
- `NODE_ENV`: development

## 📊 볼륨 및 데이터

### 데이터 볼륨

- `postgres_data`: 프로덕션 PostgreSQL 데이터
- `postgres_dev_data`: 개발 PostgreSQL 데이터

### 마운트 볼륨

- `./logs`: 애플리케이션 로그 디렉토리

## 🚀 유용한 명령어

```bash
# 특정 서비스만 실행
docker-compose up -d app mongodb

# 이미지 재빌드
docker-compose build --no-cache

# 컨테이너 내부 접속
docker-compose exec app sh
docker-compose exec mongodb mongosh

# 데이터베이스 백업
docker-compose exec mongodb mongodump --host localhost --port 27017

# 로그 실시간 모니터링
docker-compose logs -f

# 리소스 정리
docker-compose down -v  # 볼륨도 함께 삭제
docker system prune -a  # 사용하지 않는 이미지 삭제
```

## 🔒 보안 고려사항

1. **프로덕션 환경에서는 반드시 다음을 변경하세요:**

   - PostgreSQL 루트 패스워드
   - JWT 시크릿 키
   - pgAdmin 접근 계정

2. **포트 노출 최소화:**

   - 프로덕션에서는 PostgreSQL 포트(5432) 외부 노출 제거
   - pgAdmin은 개발 환경에서만 사용

3. **환경변수 관리:**
   - 민감한 정보는 Docker Secrets 또는 외부 시크릿 관리 도구 사용
   - .env 파일을 .gitignore에 추가

## 🔍 모니터링

### 헬스체크

```bash
# 애플리케이션 상태 확인
curl http://localhost:3000/api

# PostgreSQL 상태 확인
docker-compose exec postgres psql -U postgres -d career_lens -c "SELECT 1;"
```

### 리소스 모니터링

```bash
# 컨테이너 리소스 사용량
docker stats

# 특정 컨테이너 상세 정보
docker inspect career-lens-app
```
