export interface CxoneToken {
  accessToken?: string;
  accessTokenExpiry: number;
  refreshToken?: string;
  basic_header?: string;
  sub?: string;
  act?: ActModel;
  iss?: string;
}
// TODO test it
// when user is from TMA
export interface ActModel {
  sub: string;
  mame: string;
}