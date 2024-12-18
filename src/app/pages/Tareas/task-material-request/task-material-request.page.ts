import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-task-material-request',
  templateUrl: './task-material-request.page.html',
  styleUrls: ['./task-material-request.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TaskMaterialRequestPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
