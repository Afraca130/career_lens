import { Injectable } from "@nestjs/common";
import { IUserService } from "../../domain/user/user.service.interface";
import { User } from "../../domain/user/entity/user.entity";
import { 
  PasswordChangeNotAllowedException, 
  InvalidPasswordException 
} from "../../domain/user/exceptions/user.exceptions";

@Injectable()
export class UserService implements IUserService {
  canChangePassword(user: User): boolean {
    // kakao, naver로 가입한 사용자는 비밀번호 변경 불가
    return user.signType === "email";
  }

  validatePasswordChange(user: User, newPassword: string): void {
    if (!this.canChangePassword(user)) {
      throw new PasswordChangeNotAllowedException(user.signType);
    }

    if (!newPassword || newPassword.trim().length === 0) {
      throw new InvalidPasswordException("새 비밀번호를 입력해주세요.");
    }

    if (newPassword.length < 6) {
      throw new InvalidPasswordException("비밀번호는 최소 6자 이상이어야 합니다.");
    }
  }
}
