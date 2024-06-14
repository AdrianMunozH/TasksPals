import { Component, OnInit } from '@angular/core';
import {
  ITypeStatus,
  TodoCardComponent,
} from '../../shared/components/todo-card/todo-card.component';
import { TodoService } from '../../core/services/todo.service';
import { ITodo } from '../../core/models/todo.model';
import { SlidePanelComponent } from '../../shared/ui/slide-panel/slide-panel.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {AuthService} from "../../core/services/auth.service";
import {TokenService} from "../../core/services/token.service";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";
import {addWeeks, addDays, lastDayOfMonth, setMonth, setDay, getDaysInMonth, setDate} from "date-fns";

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCardComponent, SlidePanelComponent, ReactiveFormsModule, MatIcon, MatIconButton],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss',
})
export class TodoComponent implements OnInit {
  date: Date = new Date();
  todoForm!: FormGroup;
  todos: ITodo[] = [];
  todoType = ITypeStatus;
  isSlidePanelOpen = false;
  todoId: number | null = null;
  filterByStatus = '';
  constructor(private todoService: TodoService, private fb: FormBuilder, private authService: AuthService,private tokenService: TokenService) {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      taskType: new FormControl('ONCE', [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getWeeklyTasksByUserId();
  }

  getAllTodos() {
    this.todoService.getAllTodo(this.filterByStatus).subscribe({
      next: (response) => {
        this.todos = response.data;
      },
    });
  }


  getWeeklyTasksByUserId() {
    const currentDate = new Date(this.date);
    let mondaySunday = this.getMondayAndSunday(currentDate),monday =mondaySunday[0],sunday=mondaySunday[1];
    this.todoService.getWeeklyTasksByUserId(monday.toISOString().split('T')[0], sunday.toISOString().split('T')[0]).subscribe({
      next: (response) => {
        this.todos = response.data;
      }
    })
  }

  getMondayAndSunday(date: Date): Date[] {
    let day = date.getDay(),
      diff = date.getDate() - day + (day == 0 ? -6 : 1);
    return [new Date(date.setDate(diff)),new Date(date.setDate(diff + 6))];
  }


/*

  addDays(diffInDays: number) {

    if(this.date.getDate() + diffInDays > lastDayOfMonth(this.date).getDate()) {
      this.date = setMonth(this.date,this.date.getMonth()+1);
      this.date = setDay(this.date,this.date.getDay()+ diffInDays % lastDayOfMonth(this.date).getDay());
    } else {

      this.date = addDays(this.date,diffInDays);
    }
  }
*/
  addDays(diffInDays: number) {

    console.log(this.date + " Datum b4");
    console.log(this.date.getDate() + diffInDays + " " + getDaysInMonth(this.date));
    if(this.date.getDate() + diffInDays >= getDaysInMonth(this.date)) {
      const month = setMonth(this.date,this.date.getMonth()+1).getMonth() +1;
      const day = setDay(this.date,(this.date.getDay()+ diffInDays) % getDaysInMonth(this.date)).getDay()+1;
      console.log(month + " " + day);
      console.log("b4 set - " + this.date)
      this.date.setMonth(month,day);
      console.log("if")
    } else {
      console.log("else")
      this.date = addDays(this.date,diffInDays);
    }
    console.log(this.date + " Datum after");
    this.getWeeklyTasksByUserId()
  }

  /*
  setDate(diffInDays: number) {
    const newDate = new Date(this.date.getTime() + diffInDays * 24 * 60 * 60 * 1000); // 24 hours * 60 minutes * 60 seconds * 1000 milliseconds
    this.date = newDate;
    this.getWeeklyTasksByUserId();
  }
  */

  getDateTitle(): String {
    const today = new Date();
    const MS_PER_DAY = 1000 * 60 * 60 * 24;

    const diffInDays = Math.round((this.date.getTime() - today.getTime()) / MS_PER_DAY);


    if (diffInDays >= -7 && diffInDays <= 7) {
      return "This Week";
    } else if (diffInDays > 7 && diffInDays <= 14) {
      return "Next Week";
    } else if (diffInDays < -7 && diffInDays >= -14) {
      return "Last Week";
    }

    // For other cases, get the date range for the week
    const [monday, sunday] = this.getMondayAndSunday(this.date);
    return `${monday.toLocaleDateString()} - ${sunday.toLocaleDateString()}`;
  }


  openSlidePanel() {
    this.isSlidePanelOpen = true;
  }

  onCloseSlidePanel() {
    this.isSlidePanelOpen = false;
  }

  onFilterByStatus(status: string) {
    this.filterByStatus = status;
    this.getAllTodos();
  }

  onSubmit() {
    if (this.todoForm.valid) {
      if (this.todoId) {
        this.todoService
          .updateTodo(this.todoId, this.todoForm.value,this.authService)
          .subscribe({
            next: (response) => {
              this.getWeeklyTasksByUserId();
              this.onCloseSlidePanel();
            },
          });
      } else {
        this.todoService.addTodo(this.todoForm.value).subscribe({
          next: (response) => {
            this.getWeeklyTasksByUserId();
            this.onCloseSlidePanel();
          },
        });
      }
    } else {
      this.todoForm.markAllAsTouched();
    }
  }

  onLoadTodoForm(item: ITodo) {
    this.todoId = item.id!!;
    this.todoForm.patchValue({
      title: item.title,
      description: item.description,
      taskType: item.taskType,
    });
    this.openSlidePanel();
  }
}
