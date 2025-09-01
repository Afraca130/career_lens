import { Injectable } from "@nestjs/common";
import { UserContext } from "../../context/user/user.context";
import { ChangePasswordRequest } from "../../context/user/interfaces";
import { User } from "../../domain/user/entity/user.entity";

@Injectable()
export class UserBusiness {
  constructor(private readonly userContext: UserContext) {}

  async changePassword(request: ChangePasswordRequest): Promise<User> {
    return this.userContext.changePassword(request);
  }

  async findById(id: string): Promise<User | null> {
    return this.userContext.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userContext.findByEmail(email);
  }
}
