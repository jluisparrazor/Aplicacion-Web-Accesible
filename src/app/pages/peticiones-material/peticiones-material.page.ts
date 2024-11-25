import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonList,
  IonItem,
  IonButton,
  IonIcon,
  IonLabel,
  IonButtons,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  IonSelect,  // Asegúrate de importar IonSelect
  IonSelectOption  // Asegúrate de importar IonSelectOption
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-peticiones-material',
  templateUrl: './peticiones-material.page.html',
  styleUrls: ['./peticiones-material.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonList,
    IonItem,
    IonButton,
    IonIcon,
    IonLabel,
    IonButtons,
    IonGrid,
    IonRow,
    IonCol,
    IonSpinner,
    IonSelect,  // Añadido IonSelect
    IonSelectOption // Añadido IonSelectOption
  ]
})
export class PeticionesMaterialPage implements OnInit {
  newRequest: any = {
    material: '',
    cantidad: null,  // Se usará el valor de cantidad desde el desplegable
    solicitante: '',
    fecha: null
  };

  requests: Array<any> = [];
  cargando = false;

  constructor() { }

  ngOnInit() {
  }

  addRequest() {
    console.log('Valores ingresados:', this.newRequest); // Depuración
  
    // Verifica que los campos no estén vacíos
    if (
      this.newRequest.material?.trim() && // Material no vacío
      this.newRequest.cantidad > 0 && // Cantidad mayor a 0
      this.newRequest.solicitante?.trim() && // Solicitante no vacío
      this.newRequest.fecha // Fecha válida
    ) {
      // Agregar la nueva solicitud
      this.requests.push({ ...this.newRequest });
  
      // Limpia el formulario
      this.newRequest = { material: '', cantidad: null, solicitante: '', fecha: null };
    } else {
      alert('Por favor completa todos los campos correctamente.');
    }
  }
  

  deleteRequest(request: any) {
    const index = this.requests.indexOf(request);
    if (index > -1) {
      this.requests.splice(index, 1);
    } else {
      console.error('Petición no encontrada:', request);
    }
  }

  editRequest(request: any) {
    const index = this.requests.indexOf(request);
    if (index > -1) {
      this.newRequest = { ...this.requests[index] };
      this.requests.splice(index, 1);
    } else {
      console.error('Petición no encontrada:', request);
    }
  }

  trackByFn(index: number, item: any): number {
    return index;
  }
}
