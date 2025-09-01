import { Model } from "mongoose";
import { IUserRepository } from "../../domain/user/user.repository.interface";
import { User, UserDocument } from "../../domain/user/entity/user.entity";
export declare class UserRepository implements IUserRepository {
    private userModel;
    constructor(userModel: Model<UserDocument>);
    create(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<User>): Promise<User | null>;
    updatePassword(id: string, hashedPassword: string): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
