FROM node:18-alpine

WORKDIR /usr/src/app

# 패키지 파일 복사
COPY package.json pnpm-lock.yaml ./

# 의존성 설치
RUN npm install -g pnpm && pnpm install

# 소스 코드 복사
COPY . .

# 빌드 (api-gateway만)
RUN npx nest build api-gateway

# 포트 노출
EXPOSE 3000

# 애플리케이션 실행 (빌드된 파일 직접 실행)
CMD ["node", "dist/apps/api-gateway/main.js"]
