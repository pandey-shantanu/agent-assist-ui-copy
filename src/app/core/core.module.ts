import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from "./services/auth.service";
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { HttpTokenInterceptor } from "./interceptors/http.token.interceptor";
import { ApiAbsoluteService } from "./services-http/api.absolute.service";

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpTokenInterceptor, multi: true },
    ApiAbsoluteService,
    AuthService
  ],
  declarations: []
})
export class CoreModule { }
