import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { RefreshToken } from "../../domain/auth/entity/refresh-token.entity";
import { IRefreshTokenRepository } from "../../domain/auth/refresh-token.repository.interface";

@Injectable()
export class RefreshTokenRepository implements IRefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>
  ) {}

  async create(refreshToken: RefreshToken): Promise<RefreshToken> {
    const createdToken = new this.refreshTokenModel(refreshToken);
    return createdToken.save();
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ token }).exec();
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return this.refreshTokenModel
      .find({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async save(refreshToken: RefreshToken): Promise<RefreshToken> {
    return this.refreshTokenModel
      .findByIdAndUpdate(refreshToken._id, refreshToken, { new: true })
      .exec();
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.refreshTokenModel
      .deleteMany({ userId: new Types.ObjectId(userId) })
      .exec();
  }

  async deleteExpiredTokens(): Promise<void> {
    const now = new Date();
    await this.refreshTokenModel.deleteMany({ expiresAt: { $lt: now } }).exec();
  }
}
