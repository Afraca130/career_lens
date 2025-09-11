import { User } from "../../../../domain/user/entity/user.domain";

export class GetUsersResponse {
  constructor(
    public readonly users: User[],
    public readonly total: number,
    public readonly page: number,
    public readonly limit: number
  ) {}
}
