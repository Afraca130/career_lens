export interface RefreshTokenResult {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    name?: string;
  };
}
