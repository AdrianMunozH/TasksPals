import {ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatInputModule} from "@angular/material/input";

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [TodoCardComponent, SlidePanelComponent, ReactiveFormsModule, MatIcon, MatIconButton,MatFormFieldModule, MatInputModule, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  events: string[] = [];
  constructor(private todoService: TodoService, private fb: FormBuilder, private authService: AuthService,private tokenService: TokenService) {
    this.todoForm = this.fb.group({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      taskType: new FormControl('ONCE', [Validators.required]),
      taskDate: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    this.getWeeklyTasksByUserId();
    if(this.date !== null)  {
      this.date = new Date();
    }
  }

  getAllTodos() {
    this.todoService.getAllTodo(this.filterByStatus).subscribe({
      next: (response) => {
        this.todos = response.data;
      },
    });
  }

  addEvent(type: string, event: MatDatepickerInputEvent<Date>) {
    console.log(`${type}: ${event.value}`);
    this.events.push(`${type}: ${event.value}`);
  }

  getWeeklyTasksByUserId() {
    const currentDate = new Date(this.date);
    let mondaySunday = this.getMondayAndSunday(currentDate),monday = mondaySunday[0],sunday = mondaySunday[1];
    this.todoService.getWeeklyTasksByUserId(monday.toISOString().split('T')[0], sunday.toISOString().split('T')[0]).subscribe({
      next: (response) => {
        this.todos = response.data;
      }
    })
  }

  getMondayAndSunday(someDay: Date): Date[] {
    let tempdate = new Date(someDay);
    let day = tempdate.getDay(),
      diff = tempdate.getDate() - day + (day == 0 ? -6 : 1);
    return [new Date(tempdate.setDate(diff)),new Date(tempdate.setDate(diff + 6))]

  }

  addDays(diffInDays: number) {

    const currentDate = new Date(this.date); // Kopie von this.date erstellen

    if (currentDate.getDate() + diffInDays > lastDayOfMonth(currentDate).getDate()) {

      currentDate.setDate(lastDayOfMonth(currentDate).getDate());

      const daysOver = (currentDate.getDate() + diffInDays) - lastDayOfMonth(currentDate).getDate();

      currentDate.setDate(1);
      currentDate.setMonth(currentDate.getMonth() + 1);
      currentDate.setDate(currentDate.getDate() + daysOver);

    } else {

      currentDate.setDate(currentDate.getDate() + diffInDays);
    }

    this.date = currentDate;

    this.getWeeklyTasksByUserId();
  }



  getDateTitle(): String {
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Setze die Uhrzeit auf den Anfang des Tages weil es sonst zu Fehlverhalten führen kann
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffInTime = this.date.getTime() - today.getTime();
    const diffInDays = Math.floor(diffInTime / MS_PER_DAY);


    if (diffInDays >= -6 && diffInDays <= 6) {
      return "This Week";
    } else if (diffInDays > 6 && diffInDays <= 13) {
      return "Next Week";
    } else if (diffInDays < -6 && diffInDays >= -14) {
      return "Last Week";
    }


    // Show Range of Days
    const [monday, sunday] = this.getMondayAndSunday(this.date);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: '2-digit' };
    return `${monday.toLocaleDateString('en-GB', options)} - ${sunday.toLocaleDateString('en-GB', options)}`;
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
      taskDate: item.date
    });
    this.openSlidePanel();
  }
}
