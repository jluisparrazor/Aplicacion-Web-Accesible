import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInput, IonCard, IonButton, IonSpinner, IonButtons, IonIcon, IonThumbnail, IonImg, IonCardContent } from '@ionic/angular/standalone';
import { ArasaacService } from '../../common/services/arasaac.service';

@Component({
  selector: 'app-pictogram-search',
  templateUrl: './pictogram-search.component.html',
  styleUrls: ['./pictogram-search.component.scss'],
  standalone: true,
  imports: [CommonModule, IonIcon, IonButtons, IonSpinner, IonButton, IonCard, IonInput, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, FormsModule, IonThumbnail, IonImg, IonCardContent], 
})

export class PictogramSearchComponent {
  keyword: string = '';
  pictograms: any[] = [];
  cargando: boolean = false;
  selectedPictogram: any = null;

  constructor(private arasaacService: ArasaacService) {}

  async searchPictograms() {
    this.cargando = true;
    try {
      const data = await this.arasaacService.getPictograms(this.keyword);
      this.pictograms = data.slice(0, 5);
    } catch (error) {
      console.error('Error al buscar pictogramas:', error);
    } finally {
      this.cargando = false;
    }
  }

  getPictogramImageUrl(pictogram: any): string {
    return this.arasaacService.getPictogramImageUrl(pictogram);
  }

  selectPictogram(pictogram: any) {
    this.selectedPictogram = pictogram;
  }

}
