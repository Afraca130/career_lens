#!/bin/bash

# 로컬 개발 환경 시작 스크립트

echo "🚀 Career Lens 로컬 개발 환경 시작..."

# 환경 변수 설정
export DB_HOST=localhost
export DB_PORT=5432
export DB_USERNAME=postgres
export DB_PASSWORD=password
export DB_NAME=career_lens
export JWT_SECRET=your-secret-key
export USER_SERVICE_GRPC_URL=localhost:50051
export AUTH_SERVICE_GRPC_URL=localhost:50051
export API_GATEWAY_PORT=3000
export USER_SERVICE_PORT=3001

# PostgreSQL이 실행 중인지 확인
echo "📊 PostgreSQL 상태 확인..."
if ! pg_isready -h localhost -p 5432 -U postgres; then
    echo "❌ PostgreSQL이 실행되지 않았습니다. Docker로 시작합니다..."
    docker run -d --name career-lens-postgres \
        -e POSTGRES_DB=career_lens \
        -e POSTGRES_USER=postgres \
        -e POSTGRES_PASSWORD=password \
        -p 5432:5432 \
        postgres:15-alpine
    echo "⏳ PostgreSQL 시작 대기 중..."
    sleep 5
fi

# 의존성 설치
echo "📦 의존성 설치..."
npm install

# 빌드
echo "🔨 프로젝트 빌드..."
npm run build

# 백그라운드에서 user-service 시작
echo "👤 User Service 시작..."
npm run start:user &
USER_PID=$!

# 잠시 대기
sleep 3

# API Gateway 시작
echo "🌐 API Gateway 시작..."
npm run start:api-gateway &
GATEWAY_PID=$!

echo "✅ 모든 서비스가 시작되었습니다!"
echo "📊 User Service: http://localhost:3001"
echo "🌐 API Gateway: http://localhost:3000"
echo "📚 Swagger UI: http://localhost:3000/api"

# 종료 시 모든 프로세스 정리
cleanup() {
    echo "🛑 서비스 종료 중..."
    kill $USER_PID $GATEWAY_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# 프로세스가 실행 중인 동안 대기
wait
