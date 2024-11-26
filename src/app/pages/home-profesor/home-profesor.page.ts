import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ProfI } from '../../common/models/profesor.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { UserI } from '../../common/models/users.models';

import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home-profesor.page.html',
  styleUrls: ['home-profesor.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule, CommonModule 
  ],
})
export class HomePage {
  profs: ProfI[] = [];
  newProf: ProfI;
  prof: ProfI;
  cargando: boolean = false;
  students: UserI[] = [];
  newStud: UserI;
  stud: UserI;

  userActual: ProfI;

  constructor(
    private firestoreService: FirestoreService,
    private navCtrl: NavController,
    private sessionService: SessionService,
    private router: Router
  ) {
    this.load();
    //Profs
    this.loadprofs();
    this.initProf();
    this.getProf();

    //Students
    this.loadStudent();
    this.initStudent();
    this.getStudent();
  }

  load(){
    //Miro que profesor ha iniciado sesion
    const user = this.sessionService.getCurrentUser();

    if (user && 'Administrativo' in user && !user.Administrativo) {
      this.userActual = user as ProfI;
      console.log('Profesor loggeado:', this.userActual.Nombre);
    } else {
      console.error('El usuario actual no es válido.');
      this.router.navigate(['/loginprofesor']); // Redirigir al login de administrador
      return; // Detenemos la ejecución si el usuario no es válido
    }
  }
  
  // Profesor section
async addprof(){
  this.newProf.id = this.firestoreService.createIDDoc();
  await this.firestoreService.createDocumentID(this.newProf, 'Profesores', this.newProf.id);
}

  initProf(){
    this.newProf = {
      Nombre: null,
      Edad: null,
      id: this.firestoreService.createIDDoc(),
      Password:null,
      Administrativo: false
    }
  }

  loadprofs(){
  this.firestoreService.getCollectionChanges<ProfI>('Profesores').subscribe((data) => {
    if (data) {
      this.profs = data;
    }
  });
  }

  async saveProf(){
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newProf, 'Profesores', this.newProf.id);
    this.cargando = false;
    this.cleanInterface();
  }
  
  cleanInterface(){ 
    this.newProf.Nombre = null;
    this.newProf.Edad = null;
    this.newProf.Password = null;
    this.newProf.Administrativo = null;
  }


  edit(prof: ProfI){
    console.log('edit -> ', prof);
    this.newProf = prof;
  }

  async delete(prof: ProfI){
    this.cargando = true;
    console.log('delete -> ',prof.id);
    await this.firestoreService.deleteDocumentID('Profesores', prof.id);
    this.cargando = false;
  }

  async getProf(){
    const res = await this.firestoreService.getDocument<ProfI>('Profesores/'+ this.newProf.id);
    this.prof = res.data();
  }


  // Students section
  
  async addStud(){
    this.newProf.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newStud, 'Usuarios', this.newStud.id);
  }
  
  initStudent(){
    this.newStud = {
      id: this.firestoreService.createIDDoc(),
      nombre: null,
      edad: null,
      password:null,
      TipoDiscapacidad: null,
    }
  }

  loadStudent(){
  this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe((data) => {
    if (data) {
      this.students = data;
    }
  });
  }

  async saveStudent(){
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newStud, 'Usuarios', this.newStud.id);
    this.cargando = false;
    this.cleanInterface();
  }
  
  // cleanInterface(){ 
  //   this.newProf.Nombre = null;
  //   this.newProf.Edad = null;
  //   this.newProf.Password = null;
  //   this.newProf.Administrativo = null;
  // }


  editStu(student: UserI){
    console.log('edit -> ', student);
    this.newStud = student;
  }

  async deleteStu(student: UserI){
    this.cargando = true;
    console.log('delete -> ', student.id);
    await this.firestoreService.deleteDocumentID('Usuarios', student.id);
    this.cargando = false;
  }

  async getStudent(){
    const res = await this.firestoreService.getDocument<UserI>('Usuarios/'+ this.newStud.id);
    this.stud = res.data();
  }
  
  


  ChangePassword() {
    this.navCtrl.navigateForward('/change-password');
  }


}