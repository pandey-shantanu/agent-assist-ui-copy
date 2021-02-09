export interface CxoneRefreshTokenResponse {
  token: string;
  tokenExpirationTimeSec: number;
  refreshToken: string;
  refreshTokenExpirationTimeSec: string;
  // TODO sessionId: string | null;
  sessionId?: string;
}