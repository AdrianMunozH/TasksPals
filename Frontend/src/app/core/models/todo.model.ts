import {ITaskType } from '../../shared/components/todo-card/todo-card.component';
import {IUser} from "./auth.mode";


export interface IResponse<T> {
  data: T;
  message?: string;
}


export interface ITodo {
  id: number;
  title: string;
  description: string;
  taskType: ITaskType;
  creationDate: string;
  taskDate: string;
  users: IUser[];

  /*
  id?: number;
  title: string;
  description: string;
  taskType: ITaskType;

  status: ITodoType;
  task_date: string;
  users: IUser[];
  created_at?: string;
  updated_at?: string;
  */
}
