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
- Domain: `src/domain/auth/` - Auth interfaces and types
- Business: `src/business/auth/` - Auth use cases (validate user, generate token)
- Presentation: `src/presentation/auth/` - Auth controller, guards, strategies

### Database
- MongoDB with Mongoose ODM
- User entity with bcrypt password hashing
- Database config in `src/config/database.config.ts`

### Key Files
- `src/domain/user/user.entity.ts` - User domain entity
- `src/domain/user/user.repository.interface.ts` - User repository contract
- `src/business/user/create-user.use-case.ts` - User creation business logic
- `src/business/auth/validate-user.use-case.ts` - User validation logic
- `src/presentation/auth/strategies/` - Passport authentication strategies
- `src/modules/` - NestJS module configurations

## Environment Setup

Copy `.env.example` to `.env` and configure:
- MongoDB connection URI
- JWT secret key
- Application port

### MongoDB Setup
- Default connection: `mongodb://localhost:27017/mountain`
- For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/mountain`