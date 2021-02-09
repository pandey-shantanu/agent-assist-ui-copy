import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";
import { Platform } from "../constants/platform.constants";

@Injectable()
export class HttpTokenInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headersConfig = {
      "Content-Type": "application/json",
      Accept: "application/json"
    };
    const context = this.authService.Context;

    if (
      context &&
      ((/^.*\/InContactAPI\/.*$/i.test(req.url) && context.platform === Platform.acd) ||
        (/^.*\/authorization\/.*$/i.test(req.url) && context.platform === Platform.cxOne))
    ) {
      const authorizationKey = "Authorization";
      if (context.accessToken) {
        headersConfig[authorizationKey] = `Bearer ${context.accessToken}`;
      }
    } else if (
      context &&
      !(/^.*\/public\/authentication\/v1\/token$/i.test(req.url) && context.platform === Platform.cxOne) &&
      !(/^.*\/public\/authentication\/v1\/refresh$/i.test(req.url) && context.platform === Platform.cxOne) &&
      !(/^.*\/InContactAuthorizationServer\/Token$/i.test(req.url) && context.platform === Platform.acd) &&
      !/^.*\/InContactAuthorizationServer\/Token\/WhoAmI$/i.test(req.url)
    ) {
      const authorizationKey = "Authorization";
      if (context.accessToken) {
        headersConfig[authorizationKey] = `Bearer ${context.accessToken}`;
      }

      const platformKey = "IcPlatform";
      if (context.platform) {
        headersConfig[platformKey] = context.platform;
      }
    }

    // TODO currently UH is not accepting this header, fix it
    // if (
    //   context.platform === Platform.cxOne &&
    //   (/^.*\/authorization\/v1\/role\/permissions$/i.test(req.url) ||
    //     /^.*\/public\/authentication\/v1\/token$/i.test(req.url) ||
    //     /^.*\/public\/authentication\/v1\/refresh$/i.test(req.url))
    // ) {
    //   const originatingServiceIdentifierKey = "Originating-Service-Identifier";
    //   headersConfig[originatingServiceIdentifierKey] = "cxone-attendant";
    // }

    const request = req.clone({ setHeaders: headersConfig });
    return next.handle(request);
  }
}
