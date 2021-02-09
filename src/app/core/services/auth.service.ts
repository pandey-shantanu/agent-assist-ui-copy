import { Injectable, OnDestroy } from '@angular/core';
import { ReplaySubject, Observable, of, Subscription, timer } from 'rxjs';
import { take, concatMap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { UserContext } from '../interfaces/user-context.model';
import { AuthInitial } from '../interfaces/auth-initial.model';
import { Router } from '@angular/router';
import { AcdService } from '../services-http/acd.service';
import { AcdToken } from '../interfaces/acd-token.model';
import { WhoAmIModel } from '../interfaces/whoAmI.model';
import { Platform } from '../constants/platform.constants';
import { CxOneService } from '../services-http/cxone.service';
import { CxoneToken } from '../interfaces/cxone-token.model';

@Injectable({
  providedIn: "root"
})
export class AuthService implements OnDestroy {
  private isAuthenticatedSubject = new ReplaySubject<boolean>(1);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable();
  public timeoutTimer: Observable<number>;
  get isLoggedIn(): Observable<boolean> {
    return this.isAuthenticatedSubject.pipe(take(1));
  }
  // Store authentication data
  Context: UserContext;

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private acdService: AcdService,
    private cxOneService: CxOneService
  ) {}

  // This variables are for avoid the Memory leak
  subscriptions: Subscription = new Subscription();

  public populateAuth(manual: boolean = false, fakeAccessToken: string = "") {
    if (this.tokenService.platform) {
      const subPopulateAuth = of(manual)
        .pipe(
          take(1), // This will avoid memory leaks
          concatMap(m => {
            return manual || !this.Context
              ? of(this.createEmptyWhoAmIResponse())
              : this.whoAmI(this.Context.authorizationBaseUri, this.Context.accessToken);
          }),
          concatMap(whoAmIResp => {
            return manual || !this.Context
              ? of(this.createEmptyToken(fakeAccessToken, "no_token", this.tokenService.platform))
              : this.tokenExchange(
                  this.Context.platform === Platform.acd ? this.Context.authorizationBaseUri : this.Context.baseUri,
                  this.Context.accessToken,
                  this.Context.platform
                );
          }),
          concatMap(token => {
            return this.tokenService.platform === Platform.acd
              ? of(this.tokenService.saveAcdNaiaToken(this.Context, token as AcdToken))
              : of(this.tokenService.saveCxOneNaiaToken(this.Context, token as CxoneToken));
          }),
          concatMap(userContext => {
            if (!!userContext && userContext.accessToken) {
              this.Context = userContext;
              this.isAuthenticatedSubject.next(true);
              return this.isAuthenticated;
            }

            throw new Error("Invalid token");
          })
        )
        .subscribe(
          isAuthenticated => {
            if (isAuthenticated) {
              // timer to control session timeout and refresh token
              this.startTimerTokenExpiration();
            }
          },
          error => {
            this.isAuthenticatedSubject.next(false);
            this.cleanAuth();
          }
        );
      this.subscriptions.add(subPopulateAuth);
    } else {
      this.cleanAuth();
    }
  }

  private startTimerTokenExpiration() {
    if (!this.timeoutTimer)
    {
      this.timeoutTimer = timer(1000, 60 * 1000); // 1 minute
    }
    const subTimerToken = this.timeoutTimer
      .pipe(
        concatMap(val => {
          // TODO avoid 0, get server time
          return this.Context.platform === Platform.acd
            ? this.tokenService.getServerTime(this.Context.apiBaseUri)
            : of("0");
        }),
        concatMap((serverTime: string) => {
          return this.tokenService.isTokenExpired(serverTime, this.Context.platform)
            ? this.tokenService.refreshToken(
                this.Context.platform === Platform.acd ? this.Context.authorizationBaseUri : this.Context.baseUri,
                this.Context.refreshToken,
                this.Context.platform
              )
            : of(this.createEmptyToken(this.Context.accessToken, this.Context.refreshToken, this.Context.platform));
        }),
        concatMap((token: AcdToken | CxoneToken) => {
          if (!token) {
            throw new Error("empty token");
          }

          if (this.Context.platform === Platform.acd) {
            // TODO enhance this
            const acdToken = token as AcdToken;

            return of(
              this.tokenService.updateContext(
                acdToken.access_token,
                acdToken.refresh_token,
                this.tokenService.platform,
                this.Context.baseUri,
                this.Context.apiBaseUri,
                this.Context.authorizationBaseUri,
                this.Context.refreshBaseUri
              )
            );
          } else {
            const cxOneToken = token as CxoneToken;

            return of(
              this.tokenService.updateContext(
                cxOneToken.accessToken,
                cxOneToken.refreshToken,
                this.tokenService.platform,
                this.Context.baseUri,
                this.Context.apiBaseUri,
                this.Context.authorizationBaseUri,
                this.Context.refreshBaseUri
              )
            );
          }
        })
      )
      .subscribe(
        context => {
          this.Context = context;
        },
        error => {
          this.cleanAuth();
          this.router.navigate(['/']);
        }
      );
    this.subscriptions.add(subTimerToken);
  }

  cleanAuth() {
    this.Context = null;
    this.tokenService.destroySessionStorage();
    this.isAuthenticatedSubject.next(false);
  }

  completeAuthentication(initial: AuthInitial) {
    this.tokenService.setPlatform(initial.platform);
    this.Context = {
      baseUri: initial.baseUri,
      apiBaseUri: initial.apiBaseUri,
      authorizationBaseUri: initial.authorizationBaseUri,
      accessToken: initial.token, // Temporal token got from PostMessage
      expiresAt: 0,
      platform: initial.platform,
      refreshBaseUri: "",
      refreshToken: ""
    };
    this.populateAuth();
  }

  private createEmptyToken(accessToken: string, refreshToken: string, platform: string): AcdToken | CxoneToken {
    if (platform === Platform.acd) {
      const acdToken: AcdToken = {
        access_token: accessToken,
        act: null,
        agent_id: "",
        basic_header: "",
        bus_no: 0,
        expires_in: 0,
        refresh_token: refreshToken,
        refresh_token_server_uri: "",
        resource_server_base_uri: "",
        scope: "",
        sub: "",
        team_id: 0,
        token_type: "",
        iss: ""
      };

      return acdToken;
    } else {
      const cxOneToken: CxoneToken = {
        accessToken,
        accessTokenExpiry: 0,
        refreshToken,

        basic_header: "",
        act: null,
        iss: ""
      };

      return cxOneToken;
    }
  }

  whoAmI(url: string, token: string): Observable<WhoAmIModel> {
    return this.acdService.whoAmI(url, token);
  }

  tokenExchange(url: string, token: string, platform: string): Observable<AcdToken | CxoneToken> {
    return platform === Platform.acd
      ? this.acdService.tokenExchange(url, token)
      : this.cxOneService.tokenExchange(url, token);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  // ===================== Methods for Manual Authentication =====================

  private createEmptyWhoAmIResponse() {
    const whoAmIResponse: WhoAmIModel = {
      agent_id: 0,
      team_id: 0,
      bus_no: 0,
      resource_server_base_uri: "",
      refresh_token_server_uri: "",
      expires_in: 0,
      iss: "",
      sub: ""
    };
    return whoAmIResponse;
  }
}
