import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import { constants } from '../constants/constants';
import {ILoginResponse, IUser} from "../models/auth.mode";

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  isAuthentication: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );
  constructor() {
    const token = this.getToken();
    if (token) {
      this.updateToken(true);
    }
  }

  updateToken(status: boolean) {
    this.isAuthentication.next(status);
  }

  setToken(token: string,user: IUser) {
    this.updateToken(true);
    localStorage.setItem(constants.CURRENT_TOKEN, token);
    localStorage.setItem(constants.CURRENT_USER, JSON.stringify(user));
  }

  getToken(): string | null {
    return localStorage.getItem(constants.CURRENT_TOKEN);
  }

  getUser(): Observable<IUser | null> {
    const userString = localStorage.getItem(constants.CURRENT_USER);
    if (userString) {
      try {
        const user = JSON.parse(userString) as IUser;
        return of(user);
      } catch (error) {
        console.error('Error parsing user from localStorage', error);
        return of(null);
      }
    } else {
      console.error('Failed to get user');
      return of(null);
    }
  }

  removeToken() {
    this.updateToken(false);
    localStorage.removeItem(constants.CURRENT_TOKEN);
  }
}
