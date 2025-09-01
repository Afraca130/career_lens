import { User } from "./entity/user.entity";
export interface IUserRepository {
    create(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<User>): Promise<User | null>;
    updatePassword(id: string, hashedPassword: string): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
