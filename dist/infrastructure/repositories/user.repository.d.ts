import { Repository } from "typeorm";
import { IUserRepository } from "../../domain/user/user.repository.interface";
import { User } from "../../domain/user/entity/user.entity";
export declare class UserRepository implements IUserRepository {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(user: Partial<User>): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(id: string, updates: Partial<User>): Promise<User | null>;
    updatePassword(id: string, hashedPassword: string): Promise<User | null>;
    delete(id: string): Promise<boolean>;
}
