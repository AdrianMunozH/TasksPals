import { Component, Input } from '@angular/core';
import { ITodo } from '../../../core/models/todo.model';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {FormsModule} from '@angular/forms';
export type ITaskType = 'ONCE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
export const ITypeStatus = ['ONCE', 'DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'];

@Component({
  selector: 'app-todo-card',
  standalone: true,
  imports: [MatCheckboxModule,FormsModule],
  templateUrl: './todo-card.component.html',
  styleUrl: './todo-card.component.scss',
})
export class TodoCardComponent {
  @Input() todoType: ITaskType = 'ONCE';
  @Input() todo!: ITodo;
}
