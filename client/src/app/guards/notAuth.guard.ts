import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor( 
  	private authService: AuthService, 
  	private router: Router
  ) { }

  canActivate() {
    if (this.authService.loggedIn()) { //return tokenNotExpired(); treat user as if not logged in
        this.router.navigate(['/home']);
    	  return false; 
    } else {
    	  return true;
    }
    
  }
}