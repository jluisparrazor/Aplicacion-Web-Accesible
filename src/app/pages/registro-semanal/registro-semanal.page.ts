import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro-semanal',
  templateUrl: './registro-semanal.page.html',
  styleUrls: ['./registro-semanal.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class RegistroSemanalPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
