import { UserContext } from "../../context/user/user.context";
import { ChangePasswordRequest } from "../../context/user/interfaces";
import { User } from "../../domain/user/entity/user.entity";
export declare class UserBusiness {
    private readonly userContext;
    constructor(userContext: UserContext);
    changePassword(request: ChangePasswordRequest): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
