import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-choose-menus',
  templateUrl: './choose-menus.page.html',
  styleUrls: ['./choose-menus.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChooseMenusPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
