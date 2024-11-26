import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PictogramSearchComponent } from 'src/app/shared/pictogram-search/pictogram-search.component';

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.page.html',
  styleUrls: ['./pagina-inicial.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PictogramSearchComponent]
})
export class PaginaInicialPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
