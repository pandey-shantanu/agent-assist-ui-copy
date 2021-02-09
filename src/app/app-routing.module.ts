import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { AuthGuard } from './core/guards/auth.guard';
import { CommonModule } from '@angular/common';

const routes: Routes = [
  { path: "", component: LandingComponent, canActivate: [AuthGuard] },
  { path: "landing", component: LandingComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
