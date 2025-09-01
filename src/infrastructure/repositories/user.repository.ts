import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IUserRepository } from "../../domain/user/user.repository.interface";
import { User, UserDocument } from "../../domain/user/entity/user.entity";

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: Partial<User>): Promise<User> {
    const newUser = new this.userModel(user);
    return newUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email, isDeleted: false }).exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updates: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, updates, { new: true }).exec();
  }

  async updatePassword(
    id: string,
    hashedPassword: string
  ): Promise<User | null> {
    return this.userModel
      .findByIdAndUpdate(id, { password: hashedPassword }, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
    return !!result;
  }
}
