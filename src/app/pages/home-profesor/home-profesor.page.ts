import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { TeacherI } from '../../common/models/teacher.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { UserI } from '../../common/models/users.models';

import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { NavController } from '@ionic/angular';
import { CommonModule } from '@angular/common';



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
  profs: TeacherI[] = [];
  newTeacher: TeacherI;
  prof: TeacherI;
  cargando: boolean = false;
  students: UserI[] = [];
  newStud: UserI;
  stud: UserI;


  // constructor(private firestoreService: FirestoreService) {
  //   this.loadprofs();
  //   this.initProf();
  //   this.getProf();
  // }

  constructor(private firestoreService: FirestoreService, private navCtrl: NavController) {
    //Profs
    this.loadprofs();
    this.initProf();
    this.getProf();

    //Students
    this.loadStudent();
    this.initStudent();
    this.getStudent();
  }
  
  // Profesor section
async addprof(){
  this.newTeacher.id = this.firestoreService.createIDDoc();
  await this.firestoreService.createDocumentID(this.newTeacher, 'Profesores', this.newTeacher.id);
}

  initProf(){
    this.newTeacher = {
      name: null,
      surname: null,
      id: this.firestoreService.createIDDoc(),
      password: null,
      administrative: false,
      pictogramId: null,
      email: null
    }
  }

  loadprofs(){
  this.firestoreService.getCollectionChanges<TeacherI>('Profesores').subscribe((data) => {
    if (data) {
      this.profs = data;
    }
  });
  }

  async saveProf(){
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newTeacher, 'Profesores', this.newTeacher.id);
    this.cargando = false;
    this.cleanInterface();
  }
  
  cleanInterface(){ 
    // this.newTeacher.Nombre = null;
    // this.newTeacher.Edad = null;
    // this.newTeacher.Password = null;
    // this.newTeacher.Administrativo = null;
  }


  edit(prof: TeacherI){
    console.log('edit -> ', prof);
    this.newTeacher = prof;
  }

  async delete(prof: TeacherI){
    this.cargando = true;
    console.log('delete -> ',prof.id);
    await this.firestoreService.deleteDocumentID('Profesores', prof.id);
    this.cargando = false;
  }

  async getProf(){
    const res = await this.firestoreService.getDocument<TeacherI>('Profesores/'+ this.newTeacher.id);
    this.prof = res.data();
  }


  // Students section
  
  async addStud(){
    this.newTeacher.id = this.firestoreService.createIDDoc();
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
  //   this.newTeacher.Nombre = null;
  //   this.newTeacher.Edad = null;
  //   this.newTeacher.Password = null;
  //   this.newTeacher.Administrativo = null;
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