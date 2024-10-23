import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { IUccess } from '../interfaces/i-uccess';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/i-user';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  jwtHelper: JwtHelperService = new JwtHelperService();

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  authSubJect$ = new BehaviorSubject<IUccess | null>(null);

  constructor(private http: HttpClient, private router: Router) {}

  register(newUser: Partial<IUser>) {
    return this.http.post<IUccess>(this.registerUrl, newUser);
  }
}
