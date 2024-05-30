import { Injectable } from '@angular/core';
import { map, Observable} from 'rxjs';
import { IResponse, ITodo } from '../models/todo.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { apiEndpoint } from '../constants/constants';
import {AuthService} from "./auth.service";
import {TokenService} from "./token.service";
import {ILoginResponse, IUser} from "../models/auth.mode";

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  constructor(private http: HttpClient, private tokenService: TokenService) {}

  getAllTodo(status: string): Observable<IResponse<ITodo[]>> {
    let queryString = '';
    if (status !== '') {
      queryString = `status=${status}`;
    }

    // Holen des JWT-Tokens aus dem AuthService
    const jwtToken = this.tokenService.getToken();

    // Setzen des JWT-Tokens im HTTP-Header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    return this.http.get<ITodo[]>(`${apiEndpoint.TodoEndpoint.getAllTodo}${queryString}`, { headers: headers }).pipe(
      map(data => ({ data: data }))
    );
  }

  getWeeklyTasksByUserId(userId: number, startDate: string, endDate: string): Observable<IResponse<ITodo[]>> {
    // Holen des JWT-Tokens aus dem AuthService
    const jwtToken = this.tokenService.getToken();

    // Setzen des JWT-Tokens im HTTP-Header
    const headers = new HttpHeaders().set('Authorization', `Bearer ${jwtToken}`);

    // Erstellen der URL mit den Query-Parametern
    const url = `${apiEndpoint.TodoEndpoint.getWeeklyTasksByUserId}/${userId}?start=${startDate}&end=${endDate}`;

    return this.http.get<ITodo[]>(url, { headers: headers }).pipe(
      map(data => ({ data: data }))
    );
  }

  addTodo(data: ITodo, authService: AuthService): Observable<IResponse<ITodo>> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const t = this.tokenService.getToken()
    // Überprüfen, ob authService.user vorhanden ist und ein Token enthält
    if (authService.user?.user && t !== null) {
      // Hinzufügen des JWT-Tokens zum Authorization-Header
      headers = headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`);
      console.log(authService.user);
      data.users = [authService.user.user];
    } else {

      if(t !== null) {
        authService.getUserFromToken(t).subscribe(user => data.users = [this.responseUserToIUser(user)]);
      }
    }

    // POST-Anfrage mit den Daten und dem aktualisierten Header senden
    return this.http.post<IResponse<ITodo>>(
      `${apiEndpoint.TodoEndpoint.addTodo}`,
      data,
      { headers: headers }
    );
  }
  responseUserToIUser(lUser: ILoginResponse): IUser {
    return new class implements IUser {
      userId: number = lUser.user.userId;
      username: string = lUser.user.username;
    } ;
  }

  updateTodo(id: number, data: ITodo, authService: AuthService): Observable<IResponse<ITodo>> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    data.id = id;
    // Überprüfen, ob authService.user vorhanden ist und ein Token enthält
    if (authService.user && this.tokenService.getToken()) {
      // Hinzufügen des JWT-Tokens zum Authorization-Header
      headers = headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    }

    // Senden der PUT-Anfrage mit den Daten und den aktualisierten Headern
    return this.http.put<ITodo>(
      `${apiEndpoint.TodoEndpoint.updateTodo}`,
      data,
      { headers: headers }
    ).pipe(
      map(updatedTodo => ({ data: updatedTodo }))
    );
  }

}
