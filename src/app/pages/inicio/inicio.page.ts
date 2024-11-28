import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonImg, IonHeader, IonTitle, IonToolbar, IonItem, IonGrid, IonRow, IonCol, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonButton, IonCol, IonRow, IonGrid, IonItem, IonContent, IonImg, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class InicioPage implements OnInit {
src: string = "assets/imagenes/logo.png";

  constructor() { }

  ngOnInit() {
  }

}
