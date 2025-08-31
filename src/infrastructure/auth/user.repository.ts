import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import {
  IUserRepository,
  User,
} from "../../domain/auth/user.repository.interface";

// Assuming you have a User entity defined somewhere
interface UserDocument {
  _id: Types.ObjectId;
  email: string;
  name?: string;
}

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel("User") // Replace with actual User model name
    private readonly userModel: Model<UserDocument>
  ) {}

  async findById(userId: string): Promise<User | null> {
    try {
      const user = await this.userModel
        .findById(new Types.ObjectId(userId))
        .exec();

      if (!user) {
        return null;
      }

      return {
        id: user._id.toHexString(),
        email: user.email,
        name: user.name,
      };
    } catch (error) {
      return null;
    }
  }
}
