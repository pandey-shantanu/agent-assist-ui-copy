import { Injectable } from '@angular/core';
import { UserContext } from '../interfaces/user-context.model';
import { TokenClaims } from '../constants/token-claims.constants';
import { AcdToken } from '../interfaces/acd-token.model';
import { Observable } from 'rxjs';
import { AcdService } from '../services-http/acd.service';
import { Platform } from '../constants/platform.constants';
import { CxoneToken } from '../interfaces/cxone-token.model';
import { CxOneService } from '../services-http/cxone.service';

@Injectable({ providedIn: "root" })
export class TokenService {
  constructor(private acdService: AcdService, private cxOneService: CxOneService) { }

  get accessToken(): string {
    return window.sessionStorage[TokenClaims.accessToken];
  }
  public setAccessToken(value: string) {
    window.sessionStorage[TokenClaims.accessToken] = value;
  }

  get platform(): string {
    return window.sessionStorage[TokenClaims.platform];
  }
  public setPlatform(value: string) {
    window.sessionStorage[TokenClaims.platform] = value;
  }

  public destroySessionStorage() {
    window.sessionStorage.removeItem(TokenClaims.accessToken);
    window.sessionStorage.removeItem(TokenClaims.refreshToken);
    window.sessionStorage.removeItem(TokenClaims.platform);
  }

  public sessionStoragePresent() {
    return this.accessToken && this.accessToken.length > 0;
  }

  private parseJwt(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(atob(base64));
  }

  public saveAcdNaiaToken(context: UserContext, tokenClaims: AcdToken): UserContext {
    this.setAccessToken(tokenClaims.access_token);
    window.sessionStorage[TokenClaims.refreshToken] = tokenClaims.refresh_token;
    window.sessionStorage[TokenClaims.platform] = context.platform;
    // window.sessionStorage[AcdTokenClaims.RefreshTokenServerUri] = tokenClaims.refresh_token_server_uri;

    context.accessToken = tokenClaims.access_token;
    context.refreshToken = tokenClaims.refresh_token;
    context.expiresAt = tokenClaims.expires_in;
    return context;
  }

  public saveCxOneNaiaToken(context: UserContext, tokenClaims: CxoneToken): UserContext {
    this.setAccessToken(tokenClaims.accessToken);

    window.sessionStorage[TokenClaims.refreshToken] = tokenClaims.refreshToken;
    window.sessionStorage[TokenClaims.platform] = context.platform;

    context.accessToken = tokenClaims.accessToken;
    context.refreshToken = tokenClaims.refreshToken;
    context.expiresAt = tokenClaims.accessTokenExpiry;
    return context;
  }

  public getServerTime(baseUrl: string): Observable<string> {
    return this.acdService.getServerTime(baseUrl);
  }

  public isTokenExpired(serverTime: string, platform: string): boolean {
    if (platform === Platform.acd) {
      // exp come from token in seconds, we need in milliseconds to convert in a Date
      const expirationTime = this.parseJwt(this.accessToken).exp * 1000;
      const currentTime = new Date(serverTime);
      const timeBeforeExpiration = 2 * 60 * 1000;

      return currentTime.getTime() >= expirationTime - timeBeforeExpiration;
    } else {
      // TODO use server time
      // tslint:disable-next-line: no-bitwise
      const currentUnixTimestap = ~~(+new Date() / 1000);
      const expirationTime = this.parseJwt(this.accessToken).exp;
      const timeBeforeExpiration = 2 * 60;

      return currentUnixTimestap >= expirationTime - timeBeforeExpiration;
    }
  }

  public refreshToken(url: string, refreshToken: string, platform: string): Observable<AcdToken | CxoneToken> {
    return platform === Platform.acd
      ? this.acdService.refreshToken(url, refreshToken)
      : this.cxOneService.refreshToken(url, refreshToken);
  }

  public updateContext(
    accessToken: string,
    refreshToken: string,
    platform: string,
    baseUrl: string,
    apiBaseUrl: string,
    authorizationBaseUrl: string,
    refreshBaseUrl: string
  ): UserContext {
    const decoded = this.parseJwt(accessToken);
    this.setAccessToken(accessToken);

    window.sessionStorage[TokenClaims.refreshToken] = refreshToken;
    window.sessionStorage[TokenClaims.platform] = platform;

    const context: UserContext = {
      platform,
      baseUri: baseUrl,
      apiBaseUri: apiBaseUrl,
      authorizationBaseUri: authorizationBaseUrl,
      refreshBaseUri: refreshBaseUrl,
      refreshToken,
      accessToken,
      expiresAt: decoded.exp
    };

    return context;
  }
}
