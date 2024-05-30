import { Component, Input } from '@angular/core';
import { ITodo } from '../../../core/models/todo.model';

export type ITaskType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export const ITypeStatus = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent {
  @Input() todoType: ITaskType = 'ONCE';
  @Input() todo!: ITodo;
}
