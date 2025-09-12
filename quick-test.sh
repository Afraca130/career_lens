#!/bin/bash

# 빠른 테스트 스크립트

echo "🧪 빠른 테스트 시작..."

# 1. 빌드만 확인
echo "🔨 빌드 테스트..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ 빌드 성공!"
else
    echo "❌ 빌드 실패!"
    exit 1
fi

# 2. Docker로 빠른 테스트
echo "🐳 Docker로 빠른 테스트..."

# 기존 컨테이너 정리
docker-compose down 2>/dev/null

# 서비스 시작 (PostgreSQL 포함)
echo "🚀 서비스 시작..."
docker-compose up --build -d

# 서비스 준비 대기
echo "⏳ 서비스 준비 대기..."
sleep 10

# 테스트 실행
echo "🧪 API 테스트..."

# Health Check
echo "1. Health Check 테스트..."
curl -s http://localhost:3000/health | jq . || echo "❌ Health Check 실패"

# 회원가입 테스트
echo "2. 회원가입 테스트..."
curl -s -X POST http://localhost:3000/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123","name":"테스트","signType":"email"}' | jq . || echo "❌ 회원가입 실패"

# 로그인 테스트
echo "3. 로그인 테스트..."
curl -s -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com","password":"password123"}' | jq . || echo "❌ 로그인 실패"

echo "✅ 테스트 완료!"

# 정리
echo "🧹 정리 중..."
docker-compose down

echo "🎉 모든 테스트 완료!"
