import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonRow, IonCol } from '@ionic/angular/standalone';
import { ProfI } from '../../common/models/profesor.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { UserI } from '../../common/models/users.models';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { TareaI } from 'src/app/common/models/tarea.models';

@Component({
  selector: 'app-home-administrador',
  templateUrl: './home-administrador.page.html',
  styleUrls: ['./home-administrador.page.scss'],
  standalone: true,
  imports: [IonCol, IonRow, IonGrid, IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule, CommonModule],
})


export class HomeAdministradorPage {
  cargando: boolean = false;
  
  profs: ProfI[] = [];
  newProf: ProfI;
  prof: ProfI;

  students: UserI[] = [];
  newStud: UserI;
  stud: UserI;

  tareas: TareaI[] = [];
  newTarea: TareaI;
  tarea: TareaI;

  constructor(private firestoreService: FirestoreService) {
    //Profs
    this.loadprofs();
    this.initProf();
    this.getProf();

    //Students
    this.loadStudents();
    this.initStudent();
    this.getStudent();

     //Tareas
     this.loadTareas();
     this.initTarea();
     this.getTarea();
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

  loadStudents(){
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
  
  
  // Tareas section

  initTarea(){
    this.tarea = {
      id: this.firestoreService.createIDDoc(),
      Nombre: null,
      Completada: null,
      Fecha: null,
    }
  }

  loadTareas(){
  this.firestoreService.getCollectionChanges<TareaI>('Tareas').subscribe((data) => {
    if (data) {
      this.tareas = data;
      console.log('tareas -> ', this.tareas);
    }
  });
  }

  addTarea(){
    console.log('add -> ', this.newTarea);
  }

  editTarea(tarea: TareaI){
    console.log('edit -> ', tarea);
    this.newTarea = tarea;  }

  async deleteTarea(tarea: TareaI){
    this.cargando = true;
    console.log('delete -> ', tarea.id);
    await this.firestoreService.deleteDocumentID('Tareas', tarea.id);
    this.cargando = false;
  }
  
  async getTarea(){
    const res = await this.firestoreService.getDocument<TareaI>('Tareas/'+ this.newTarea.id);
    this.tarea = res.data();
  }

  async saveTarea(){
    this.cargando = true;
    await this.firestoreService.createDocumentID(this.newStud, 'Tareas', this.newTarea.id);
    this.cargando = false;
    this.cleanInterface();
  }
  // ChangePassword() {
  //   this.navCtrl.navigateForward('/change-password');
  // }


}
