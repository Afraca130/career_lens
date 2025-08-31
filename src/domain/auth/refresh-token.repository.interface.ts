import { RefreshToken } from "./entity/refresh-token.entity";
import { Types } from "mongoose";

export interface IRefreshTokenRepository {
  create(refreshToken: RefreshToken): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  save(refreshToken: RefreshToken): Promise<RefreshToken>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpiredTokens(): Promise<void>;
}

export const IRefreshTokenRepository = Symbol("IRefreshTokenRepository");
