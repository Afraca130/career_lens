# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

NestJS backend application with JWT authentication and user management following Domain-Driven Design (DDD) architecture with bounded contexts.

## Development Commands

- `npm run start:dev` - Start development server with hot reload
- `npm run build` - Build the application
- `npm run start:prod` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode

## API Documentation

- Swagger UI: `http://localhost:3000/api`
- Automatic API documentation with request/response schemas
- JWT authentication support in Swagger UI

## Architecture

### DDD Layer Structure

**Domain Layer** (`src/domain/`)
- Pure business entities and interfaces
- Domain models without external dependencies
- Repository interfaces defining contracts

**Business Layer** (`src/business/`)
- Use cases implementing business logic
- Repository implementations
- Business rules and validations

**Presentation Layer** (`src/presentation/`)
- Controllers handling HTTP requests
- DTOs for request/response mapping
- Guards and strategies for authentication

### Bounded Contexts

**User Context**
- Domain: `src/domain/user/` - User entity and repository interface
- Business: `src/business/user/` - User use cases and repository implementation
- Presentation: `src/presentation/user/` - User controller and DTOs

**Auth Context**
- Domain: `src/domain/auth/` - Auth interfaces, types, and refresh token entity
- Business: `src/business/auth/` - Auth use cases (validate user, generate token, refresh token)
- Presentation: `src/presentation/auth/` - Auth controller, guards, strategies

### Database
- MongoDB with Mongoose ODM
- User entity with bcrypt password hashing
- RefreshToken entity for token management
- Database config in `src/config/database.config.ts`

### Features
- **Authentication**: Dual token system (access + refresh)
- **API Documentation**: Swagger UI with JWT support
- **Logging**: Request/response logging interceptor
- **Validation**: Class-validator for request validation
- **Security**: Password hashing, JWT token security

### Key Files
- `src/domain/user/user.entity.ts` - User domain entity
- `src/domain/auth/refresh-token.entity.ts` - Refresh token entity
- `src/business/user/create-user.use-case.ts` - User creation business logic
- `src/business/auth/generate-token.use-case.ts` - Token generation logic
- `src/business/auth/refresh-token.use-case.ts` - Token refresh logic
- `src/presentation/auth/strategies/` - Passport authentication strategies
- `src/common/interceptors/logging.interceptor.ts` - Request logging
- Domain modules: `src/domain/*/` - NestJS module configurations

## Environment Setup

Copy `.env.example` to `.env` and configure:
- MongoDB connection URI
- JWT secret key
- Application port

### MongoDB Setup
- Default connection: `mongodb://localhost:27017/mountain`
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/mountain`

## API Endpoints

### Authentication
- `POST /auth/login` - User login (returns access + refresh tokens)
- `POST /auth/refresh` - Refresh access token using refresh token

### Users
- `POST /users/register` - User registration
- `GET /users/profile` - Get user profile (requires authentication)

## Token Management
- **Access Token**: 24시간 유효, API 요청 시 Bearer 토큰으로 사용
- **Refresh Token**: 30일 유효, 액세스 토큰 갱신용