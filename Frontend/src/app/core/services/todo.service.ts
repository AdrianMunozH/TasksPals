import { Injectable } from '@angular/core';
import {catchError, from, map, Observable, of, switchMap} from 'rxjs';
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
  constructor(private http: HttpClient, private tokenService: TokenService, private authService: AuthService) {}


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


  getWeeklyTasksByUserId(startDate: string, endDate: string): Observable<IResponse<ITodo[]>> {
    let user = this.tokenService.getUser();
    let userId;
    user.subscribe(data => {userId = data?.id});

    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    const token = this.tokenService.getToken();

    const url = `${apiEndpoint.TodoEndpoint.getWeeklyTasksByUserId}/${userId}?start=${startDate}&end=${endDate}`;

    return this.http.get<ITodo[]>(url, { headers: headers }).pipe(
      map(data => ({ data: data }))
    );
  }


  addTodo(data: ITodo): Observable<IResponse<ITodo>> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    const token = this.tokenService.getToken();

    return from(this.tokenService.getUser()).pipe(
      switchMap(user => {
        if (user) {
          headers = headers.set('Authorization', `Bearer ${token}`);
          data.users = [user];
          console.log(this.authService.user);
          console.log(user);

          return this.http.post<IResponse<ITodo>>(
            `${apiEndpoint.TodoEndpoint.addTodo}`,
            data,
            { headers: headers }
          );
        } else {
          return of({
            message: 'User not found or not authenticated',
            data: null
          } as unknown as IResponse<ITodo>);
        }
      }),
      catchError(error => {
        console.error(error);
        return of({
          message: 'An error occurred',
          data: null
        } as unknown as IResponse<ITodo>);
      })
    );
  }

  responseUserToIUser(lUser: ILoginResponse): IUser {
    return new class implements IUser {
      id: number = lUser.user.id;
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

  updateCompleted(id: number,completed: boolean, authService: AuthService): Observable<IResponse<ITodo>> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');

    // Überprüfen, ob authService.user vorhanden ist und ein Token enthält
    if (authService.user && this.tokenService.getToken()) {
      // Hinzufügen des JWT-Tokens zum Authorization-Header
      headers = headers.set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    }

    return this.http.put<ITodo>(
        `${apiEndpoint.TodoEndpoint.isCompleted}/${id}?isCompleted=${completed}`,
        null,
        { headers: headers }
      ).pipe(
        map(updatedTodo => ({ data: updatedTodo }))
      );
  }
}
