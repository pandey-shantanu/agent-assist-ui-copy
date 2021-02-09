import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CxoneToken } from '../interfaces/cxone-token.model';
import { map } from 'rxjs/operators';
import { AppConstants } from '../constants/app-constants';
import { ApiAbsoluteService } from './api.absolute.service';
import { CxoneRefreshTokenResponse } from '../interfaces/cxone-refresh-token-response.model';

const AUTHKEY = `Basic ${btoa(AppConstants.clientId)}`;

@Injectable({ providedIn: "root" })
export class CxOneService {
  constructor(private apiAbsoluteService: ApiAbsoluteService) {}

  public tokenExchange(domainUrl: string, accessToken: string): Observable<CxoneToken> {
    const url = `${domainUrl}${AppConstants.cxonePaths.tokenExchange}`;
    const headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", AUTHKEY);
    const body = { accessToken };

    return this.apiAbsoluteService.post(url, body, { headers }).pipe(map(data => data as CxoneToken));
  }

  public refreshToken(domainUrl: string, refreshToken: string): Observable<CxoneToken> {
    const url = `${domainUrl}${AppConstants.cxonePaths.tokenRefresh}`;
    const body = { token: refreshToken };

    return this.apiAbsoluteService.post(url, body, {}).pipe(
      map(data => {
        const refreshTokenResponse = data as CxoneRefreshTokenResponse;
        const cxOneToken: CxoneToken = {
          accessToken: refreshTokenResponse.token,
          accessTokenExpiry: refreshTokenResponse.tokenExpirationTimeSec,
          refreshToken: refreshTokenResponse.refreshToken
        };

        return cxOneToken;
      })
    );
  }
}
