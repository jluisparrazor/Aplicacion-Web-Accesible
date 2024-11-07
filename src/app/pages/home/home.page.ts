import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { UserI } from '../../common/models/users.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule
  ],
})
export class HomePage {
  users: UserI[] = [];
  newUser: UserI;
  cargando: boolean = false;
  user: UserI;

  constructor(private firestoreService: FirestoreService) {
    this.loadusers();
    this.initUser();
    this.getUser();
  }

  async addUser(){
  this.newUser.id = this.firestoreService.createIDDoc();
  await this.firestoreService.createDocumentID(this.newUser, 'Usuarios', this.newUser.id);
}

  initUser(){
    this.newUser = {
      nombre: null,
      edad: null,
      id: this.firestoreService.createIDDoc(),
      password:null,
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
  
  edit(user: UserI){
    console.log('edit -> ', user);
    this.newUser = user;
  }

  async delete(user: UserI){
    this.cargando = true;
    console.log('delete -> ',user.id);
    await this.firestoreService.deleteDocumentID('Usuarios', user.id);
    this.cargando = false;
  }

  async getUser(){

    const uid = "64c0874c-7338-4ee7-9fec-6352547d2032";
    // this.firestoreService.getDocumentChanges<UserI>('Usuarios/'+ uid).subscribe(data => {
    //   console.log('getUser -> ', data);
    //   if(data){
    //     this.user = data
    //   }
    // });

    const res = await this.firestoreService.getDocument<UserI>('Usuarios/'+ uid);
    this.user = res.data();
    //this.firestoreService.getDocument('Usuarios/'+ uid).then(data => {
      //data.ref.id
 //   });
  }


}