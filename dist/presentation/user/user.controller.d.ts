import { UserBusiness } from "../../business/user/user.business";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { User } from "../../domain/user/entity/user.entity";
export declare class UserController {
    private readonly userBusiness;
    constructor(userBusiness: UserBusiness);
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<User>;
}
