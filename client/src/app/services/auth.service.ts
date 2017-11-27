import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

domain = "http://192.168.33.13:8080";

  constructor(

  	private http: Http

  ) { }


  registerUser(user){

  	return this.http.post(this.domain + '/authentication/register', user).map(res => res.json());
  }

}

