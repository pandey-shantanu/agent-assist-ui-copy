import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { AuthService } from "../core/services/auth.service";
import { fromEvent, Subscription } from "rxjs";
import { Platform } from "../core/constants/platform.constants";
import { EnvService } from '../core/services/env.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  private subscriptions = new Subscription();
  loaded: boolean;
  displayError: boolean;
  initIsAuthenticatedSub = false;
  myToken = "";
  authBaseUrl = "";
  inContactApiBaseUrl = "";
  inContactAuthorizationBaseUrl = "";
  envName: string;
  displayNotifications: boolean;
  openingNaia = true;

  constructor(private authService: AuthService,
              private envService: EnvService,
              private spinner: NgxSpinnerService) {
      this.loaded = false;
      this.displayError = false;
      this.displayNotifications = false;
      this.envName = envService.GetEnvName();
      console.log("Is it prod? = ", this.envName);
     }

     ngOnInit() {
      this.spinner.show();
      this.authenticationSubscription();

      if (this.loaded === false) {
        if (this.envName === "local") {
          this.myToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpY0JVSWQiOjEwMCwibmFtZSI6ImFtZWRyYW5vQGRvNTkuY29tIiwiaXNzIjoiaHR0cHM6Ly9hcGktZG81OS5kZXYubmljZS1pbmNvbnRhY3QuY29tIiwic3ViIjoidXNlcjoxMDg3IiwiYXVkIjoiaW5Db250YWN0IEFkbWluQGluQ29udGFjdCBJbmMuIiwiZXhwIjoxOTAwODA5MDY0LCJpYXQiOjE5MDA4MDU0NjUsImljU2NvcGUiOiIxLDIsNCw4IiwiaWNDbHVzdGVySWQiOiJETzU5IiwiaWNBZ2VudElkIjoxMDg3LCJpY1NQSWQiOjcsImdpdmVuX25hbWUiOiJBZHJpYW4iLCJmYW1pbHlfbmFtZSI6Ik1lZHJhbm8iLCJuYmYiOjE2MDA4MDU0NjR9.mld28BVR3rhtoMuc_XmQlyspPSLhrGWpZ8kRHVA5AIVeEShxIifSpnLpKr_Wpbu-EErw47vy-CgUKbrkfKH0xrI5TuCfqqFx-MpnLpKcCzRy5UPUM3kzBVgQUIqnzxQcY86umC8vHQbhRRjP5h5g732qJc89glcCqSrbev7rLwoCG8NzNyZrddxsBUYi96-w296pvTauk1VU3dFmujtlaIrweuI17Rq9XJjYxlbODPfqCpzT_nsOfe-vM62p4AeSKBarqHg75xBY9IEHVCa9PfEL7VHBOKQPdMGTSaM8LZfn1KjmKtO6UIcLFI3UTidgF28pmEudUQmA8mDvGiwKlQ";
          this.manualAuthentication(this.myToken, Platform.acd, "do59");
        }
        else {
          const message = fromEvent(window, "message");
          const subscription = message.subscribe(event => {
            const dataKey = "data";
            let platform = Platform.acd;
            if (event[dataKey].token) {
              // We are not using this received token, because
              // we are using /inContact/API/ApiApplicationService.svc/GetMAXApiToken
              this.myToken = event[dataKey].token;
              const urls = event[dataKey].url || event[dataKey].urls;
              this.setBaseUrls(urls);
              this.spinner.hide();
              this.loaded = true;
              platform = event[dataKey].isCentral === true ? Platform.acd : Platform.cxOne;
              console.log(platform);
            }
            this.completeAuthentication(this.loaded, platform);
          },
          error => {
            console.log('Error occurred while retrieving token from MAX agent');
            this.displayError = true;
          });
          this.subscriptions.add(subscription);
        }
      }

      const eventObj = {
        messageType: "Loaded",
        issuer: "Naia"
      };
      const opener = window.parent || window.opener;
      if (opener) {
        opener.postMessage(eventObj, "*");
      }
    }

    ngOnDestroy(): void {
      if (this.subscriptions) {
        this.subscriptions.unsubscribe();
      }
      this.authService.cleanAuth();
    }

    setBaseUrls(urls: any) {
      if (urls) {
        this.authBaseUrl = urls.authBaseUrl;
        this.inContactApiBaseUrl = `${urls.inContactBaseUrl}/InContactAPI/`;
        this.inContactAuthorizationBaseUrl = `${urls.inContactBaseUrl}/InContactAuthorizationServer/`;

        if (this.authBaseUrl.lastIndexOf("/") !== this.authBaseUrl.length - 1) {
          this.authBaseUrl = this.authBaseUrl + "/";
        }

        if (this.inContactApiBaseUrl.lastIndexOf("/") !== this.inContactApiBaseUrl.length - 1) {
          this.inContactApiBaseUrl = this.inContactApiBaseUrl + "/";
        }

        this.inContactApiBaseUrl = this.inContactApiBaseUrl.replace("home-", "api-");
        this.inContactAuthorizationBaseUrl = this.inContactAuthorizationBaseUrl.replace("home-", "api-");
      }
    }
    authenticationSubscription() {
      if (!this.initIsAuthenticatedSub) {
        console.log('initIsNotAuthenticatedSub');
        const subIsAuthenticated = this.authService.isAuthenticated.subscribe(isAuthenticated => {
          this.loaded = false;
          if (isAuthenticated) {
            this.displayNotifications = true;
            this.displayError = false;
          } else {
            if (this.openingNaia)
            {
              this.openingNaia = false;
            }
            else
            {
              this.spinner.hide();
              this.displayError = true;
              this.displayNotifications = false;
            }
          }
        },
        error => {
          console.log("AUTHENTICATION ERROR: ", performance.now());
          this.spinner.hide();
          this.displayError = true;
          this.displayNotifications = false;
        });
        this.subscriptions.add(subIsAuthenticated);
        this.initIsAuthenticatedSub = true;
      }
    }

    manualAuthentication(token: string, platform: string, cluster: string) {
      const inContacturl = "https://home-" + cluster + ".dev.nice-incontact.com/";
      const authUrl = platform === "acd" ? "https://home-" + cluster + ".dev.nice-incontact.com/" : "https://na1.dev.nice-incontact.com/";
      const urls = { authBaseUrl: authUrl, inContactBaseUrl: inContacturl };
      this.setBaseUrls(urls);
      this.spinner.hide();
      this.loaded = true;
      this.completeAuthentication(this.loaded, platform);
    }

    completeAuthentication(isLoaded: boolean, platform: string) {
      if (isLoaded) {
        // This method is async
        try {
          this.authService.completeAuthentication({
            token: this.myToken,
            baseUri: this.authBaseUrl,
            apiBaseUri: this.inContactApiBaseUrl,
            authorizationBaseUri: this.inContactAuthorizationBaseUrl,
            platform
          });
        }
        catch (error) {
          this.displayError = true;
          console.log("AUTHENTICATION ERROR: ", performance.now());
        }
      } else {
        this.displayError = true;
        console.log("AUTHENTICATION ERROR: ", performance.now());
      }
    }

}
