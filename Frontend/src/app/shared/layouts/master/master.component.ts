import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import {MatSidenavModule} from "@angular/material/sidenav";

@Component({
  selector: 'app-master',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent,MatSidenavModule],
  templateUrl: './master.component.html',
  styleUrl: './master.component.scss',
})
export class MasterComponent {}
