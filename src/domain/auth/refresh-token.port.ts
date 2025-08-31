import { RefreshTokenCommand } from "./refresh-token.command";
import { RefreshTokenResult } from "./refresh-token-result.interface";

export interface RefreshTokenPort {
  execute(command: RefreshTokenCommand): Promise<RefreshTokenResult>;
}
