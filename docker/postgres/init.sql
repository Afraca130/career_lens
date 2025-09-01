-- PostgreSQL 초기화 스크립트

-- 개발용 데이터베이스 생성 (production은 환경변수로 생성됨)
CREATE DATABASE career_lens_dev;

-- 사용자 생성 (필요시)
-- CREATE USER career_lens_user WITH PASSWORD 'career_lens_password';

-- 권한 부여 (필요시)
-- GRANT ALL PRIVILEGES ON DATABASE career_lens TO career_lens_user;
-- GRANT ALL PRIVILEGES ON DATABASE career_lens_dev TO career_lens_user;

-- 초기화 완료 메시지
\echo 'PostgreSQL initialization completed for career-lens databases';
