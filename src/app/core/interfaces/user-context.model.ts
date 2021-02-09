export interface UserContext {
  platform: string;
  baseUri: string;
  // TODO acdApiBaseUri
  apiBaseUri: string;
  authorizationBaseUri: string;
  refreshBaseUri: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}