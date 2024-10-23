import { Component } from '@angular/core';
import { AuthorizeService } from '../authorize.service';
import { IUser } from '../../interfaces/i-user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  formRegister: Partial<IUser> = {};

  constructor(private authSvc: AuthorizeService, private router: Router) {}

  register() {
    this.authSvc.register(this.formRegister).subscribe((res) => {
      this.router.navigate(['/auth/login']);

      console.log(this.formRegister);
    });
  }
}
