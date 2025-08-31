import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  collection: "refresh_tokens",
  timestamps: true,
})
export class RefreshToken extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true })
  token: string;

  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  userId: Types.ObjectId;

  @Prop({ required: true })
  expiresAt: Date;

  @Prop({ default: false })
  isRevoked: boolean;

  createdAt: Date;
  updatedAt: Date;

  constructor(token: string, userId: Types.ObjectId, expiresAt: Date) {
    super();
    this.token = token;
    this.userId = userId;
    this.expiresAt = expiresAt;
    this.isRevoked = false;
  }

  isExpired(): boolean {
    return new Date() > this.expiresAt;
  }

  revoke(): void {
    this.isRevoked = true;
  }
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);
