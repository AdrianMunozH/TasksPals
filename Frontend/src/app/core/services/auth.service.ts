import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {ILogin, ILoginResponse, IUser} from '../models/auth.mode';
import { apiEndpoint } from '../constants/constants';
import {Observable, map } from 'rxjs';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  user: ILoginResponse | undefined;

  constructor(private http: HttpClient, private tokenService: TokenService) {}

  onLogin(data: ILogin): Observable<ILoginResponse> {
    return this.http
      .post<ILoginResponse>(`${apiEndpoint.AuthEndpoint.login}`, data)
      .pipe(
        map((response) => {
          if (response) {
            console.log(response)
            this.tokenService.setToken(response.jwt,response.user);
            this.user = response;
          }
          return response;
        })
      );
  }

  onLogout() {
    this.http.post(`${apiEndpoint.AuthEndpoint.logout}`, '').subscribe({
      next: (response) => {
        this.tokenService.removeToken();
      },
    });
  }

  // TODO
  getUserFromToken(jwt: string): Observable<ILoginResponse> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwt}`);
    return this.http.get<any>(`${apiEndpoint.AuthEndpoint.loggedUser}`, { headers: headers });
  }


}
