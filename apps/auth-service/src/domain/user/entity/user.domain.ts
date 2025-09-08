/**
 * 사용자 도메인 엔티티
 * 비즈니스 로직과 규칙을 포함하는 순수한 도메인 객체
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly role: string,
    public readonly signType: string,
    public readonly isVerified: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly refreshToken?: string
  ) {}

  /**
   * 사용자가 비밀번호를 변경할 수 있는지 확인
   */
  canChangePassword(): boolean {
    return this.signType === "email";
  }

  /**
   * 사용자가 활성 상태인지 확인
   */
  isActive(): boolean {
    return !this.isDeleted;
  }

  /**
   * 사용자가 관리자인지 확인
   */
  isAdmin(): boolean {
    return this.role === "admin";
  }

  /**
   * 사용자 정보를 업데이트 (불변성 유지)
   */
  updatePassword(newPassword: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      newPassword,
      this.role,
      this.signType,
      this.isVerified,
      this.isDeleted,
      this.createdAt,
      new Date(), // updatedAt 업데이트
      this.refreshToken
    );
  }

  /**
   * 사용자 정보를 업데이트 (불변성 유지)
   */
  updateProfile(name: string, email: string): User {
    return new User(
      this.id,
      name,
      email,
      this.password,
      this.role,
      this.signType,
      this.isVerified,
      this.isDeleted,
      this.createdAt,
      new Date(), // updatedAt 업데이트
      this.refreshToken
    );
  }

  /**
   * 사용자 삭제 (소프트 삭제)
   */
  delete(): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.role,
      this.signType,
      this.isVerified,
      true, // isDeleted = true
      this.createdAt,
      new Date(), // updatedAt 업데이트
      this.refreshToken
    );
  }

  /**
   * 사용자 생성 팩토리 메서드
   */
  static create(
    name: string,
    email: string,
    password: string,
    signType: string = "email"
  ): User {
    const now = new Date();
    return new User(
      "", // ID는 저장소에서 생성
      name,
      email,
      password,
      "user", // 기본 역할
      signType,
      false, // 기본적으로 미인증
      false, // 기본적으로 삭제되지 않음
      now,
      now,
      undefined // refreshToken은 로그인 시 생성
    );
  }

  /**
   * Refresh Token 업데이트
   */
  updateRefreshToken(refreshToken: string): User {
    return new User(
      this.id,
      this.name,
      this.email,
      this.password,
      this.role,
      this.signType,
      this.isVerified,
      this.isDeleted,
      this.createdAt,
      new Date(), // updatedAt 업데이트
      refreshToken
    );
  }
}
