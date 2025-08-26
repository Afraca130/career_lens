import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema({
  collection: "users",
  timestamps: true,
})
export class User extends Document {
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  name?: string;

  createdAt: Date;
  updatedAt: Date;

  constructor(email: string, password: string, name?: string) {
    super();
    this.email = email;
    this.password = password;
    this.name = name;
  }
}

export const UserSchema = SchemaFactory.createForClass(User);
