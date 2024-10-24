import { Component } from '@angular/core';
import { ILogin } from '../../interfaces/i-login';
import { AuthorizeService } from '../authorize.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  formData: ILogin = {
    email: '',
    password: '',
  };

  constructor(private authSvc: AuthorizeService, private router: Router) {}

  login() {
    this.authSvc.login(this.formData).subscribe((data) => {
      this.router.navigate(['/account']);
    });
  }
}
