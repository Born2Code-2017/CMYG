import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { ManagerDBModule } from './dbManager.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private db: ManagerDBModule) {
  }

  canActivate() {
    if (this.db.isUserLogged()) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }
}
