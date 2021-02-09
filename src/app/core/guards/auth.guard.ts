import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { AuthService } from "../services/auth.service";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root"
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot // : Observable<boolean> | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  ): Observable<boolean> {
    return this.authService.isLoggedIn.pipe(
      map(e => {
        if (e) {
          return true;
        } else {
          this.router.navigate(["/landing"], { queryParamsHandling: 'preserve' });
          return false;
        }
      }),
      catchError(err => {
        this.router.navigate(["/landing"]);
        return of(false);
      })
    );
  }
}
