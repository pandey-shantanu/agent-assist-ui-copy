import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AcdToken } from '../interfaces/acd-token.model';
import { map } from 'rxjs/operators';
import { AppConstants } from '../constants/app-constants';
import { ApiAbsoluteService } from './api.absolute.service';
import { WhoAmIModel } from '../interfaces/whoAmI.model';
import { AcdServerTime } from '../interfaces/acd-server-time.model';

const AUTHKEY = "Basic " + btoa(AppConstants.clientId + ":Mjk1MzRjZDY1ZjhkNGNmZTk2NmE0MDIzYTIyNTZlOTk=");

@Injectable({ providedIn: "root" })
export class AcdService {
  constructor(private apiAbsoluteService: ApiAbsoluteService) {}

  public whoAmI(domainUrl: string, token: string): Observable<WhoAmIModel> {
    const url = `${domainUrl}${AppConstants.acdPaths.whoAmIPath}`;
    const headers = new HttpHeaders().set("Content-Type", "application/json").set("Authorization", "null");
    const body = { token };

    return this.apiAbsoluteService.post(url, body, { headers }).pipe(map(data => data as WhoAmIModel));
  }

  public tokenExchange(domainUrl: string, accessToken: string): Observable<AcdToken> {
    const url = `${domainUrl}${AppConstants.acdPaths.tokenExchange}`;
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=UTF-8").set("Authorization", AUTHKEY);
    const body = {
      access_token: accessToken,
      grant_type: "token_exchange"
    };

    return this.apiAbsoluteService.post(url, body, { headers }).pipe(map(data => data as AcdToken));
  }

  public refreshToken(domainUrl: string, refreshToken: string): Observable<AcdToken> {
    const url = `${domainUrl}${AppConstants.acdPaths.tokenExchange}`;
    const headers = new HttpHeaders().set("Content-Type", "text/plain;charset=UTF-8").set("Authorization", AUTHKEY);
    const body = {
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    };

    return this.apiAbsoluteService.post(url, body, { headers }).pipe(map(data => data as AcdToken));
  }

  public getServerTime(domainUrl: string): Observable<string> {
    const url = `${domainUrl}${AppConstants.acdPaths.serverTime}`;

    return this.apiAbsoluteService.get(url).pipe(
      map(
        (serverTimeACD: AcdServerTime) => serverTimeACD.ServerTime,
        (error: any) => {
          throw Error(error);
        }
      )
    );
  }
}
