import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner } from '@ionic/angular/standalone';
import { UserI } from '../common/models/users.models';
import { FirestoreService } from '../common/services/firestore.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner],
})
export class HomePage {
  users: UserI[] = [];
  newUser: UserI;
  cargando: boolean = false;
  
  constructor(private firestoreService: FirestoreService) {
    this.loadusers();
    this.initUser();
  }

  initUser(){
    this.newUser = {
      nombre: null,
      edad: null,
      id: this.firestoreService.createIDDoc(),

    }
  }

  loadusers(){
  this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe((data) => {
    if (data) {
      this.users = data;
    }
  });
  }

  async save(){
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id);
    this.cargando = false;
  }
  
   
  
}
