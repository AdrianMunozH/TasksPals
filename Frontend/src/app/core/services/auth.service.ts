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

  onLogin(data: ILogin) {
    return this.http
      .post<ILoginResponse>(`${apiEndpoint.AuthEndpoint.login}`, data)
      .pipe(
        map((response) => {
          if (response) {
            console.log(response)
            this.tokenService.setToken(response.jwt);
            this.user = response;
            console.log(this.user);
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
    return this.http.get<any>('https://example.com/api/v1/user', { headers: headers });
  }

//  refreshUser(): Observable<ILoginResponse>{
//    const token = this.tokenService.getToken();
//    const response;
//    if (token !== null) {
//       response = this.getUserFromToken(token).subscribe(user => this.user = user);
//    }
//    return response;
//  }
}
