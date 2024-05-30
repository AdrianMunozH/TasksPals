export interface IUser {
  userId: number;
  username: string;
}
export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginResponse {
  message: string;
  jwt: string;
  user: IUser;
}
