import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, map, tap } from 'rxjs';
import { IUccess } from '../interfaces/i-uccess';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { IUser } from '../interfaces/i-user';
import { ILogin } from '../interfaces/i-login';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {
  jwtHelper: JwtHelperService = new JwtHelperService();

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  authSubJect$ = new BehaviorSubject<IUccess | null>(null);

  isLoggedIn: boolean = false;
  isLoggedIn$ = this.authSubJect$.pipe(map((accessData) => !!accessData)); //serve per la verifica, capta la presenza(o meno) dello user e mi restituisce un bool (false se il subject riceve null)

  constructor(private http: HttpClient, private router: Router) {}

  register(newUser: Partial<IUser>) {
    return this.http.post<IUccess>(this.registerUrl, newUser);
  }

  login(authData: ILogin) {
    return this.http.post<IUccess>(this.loginUrl, authData).pipe(
      tap((accessData) => {
        this.authSubJect$.next(accessData); //invio lo user al subject
        localStorage.setItem('accessData', JSON.stringify(accessData)); //salvo lo user per poterlo recuperare se si ricarica la pagina

        //Recupero la data di scadenza del token
        const expDate = this.jwtHelper.getTokenExpirationDate(
          accessData.accessToken
        );

        //se c'è un errore con la data blocca la funzione
        if (!expDate) return;

        //Avvio il logout automatico.
        this.autoLogout(expDate);
      })
    );
  }
  logout() {
    this.authSubJect$.next(null); //comunico al behaviorsubject che il valore da propagare è null
    localStorage.removeItem('accessData'); //elimino i dati salvati in localstorage
    this.router.navigate(['/auth/login']); //redirect al login
  }
  autoLogoutTimer: any;

  autoLogout(expDate: Date) {
    // clearTimeout(this.autoLogoutTimer)
    const expMs = expDate.getTime() - new Date().getTime(); //sottraggo i ms della data attuale da quelli della data del jwt

    this.autoLogoutTimer = setTimeout(() => {
      //avvio un timer che fa logout allo scadere del tempo
      this.logout();
    }, expMs);
  }
}
