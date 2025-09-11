import { User } from "../../../../domain/user/entity/user.domain";

export class UpdateProfileResponse {
  constructor(public readonly user: User) {}
}
