import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ProfI } from '../../common/models/profesor.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { UserI } from '../../common/models/users.models';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { TareaI } from 'src/app/common/models/tarea.models';
import { doc, Timestamp } from 'firebase/firestore';
import { RouterModule } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-administrador',
  templateUrl: './home-administrador.page.html',
  styleUrls: ['./home-administrador.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, IoniconsModule, CommonModule, RouterModule],
})


export class HomeAdministradorPage{
  tempFecha: string | null = null;
  
  profs: ProfI[] = [];
  newProf: ProfI;
  prof: ProfI;

  students: UserI[] = [];
  newStud: UserI;
  stud: UserI;

  tareas: TareaI[] = [];
  newTarea: TareaI;
  tarea: TareaI;
  selectedStudent: UserI; // Estudiante al que se asignará la tarea

  userActual: ProfI;

  showForm = false; // Variable para mostrar/ocultar el formulario de tarea


  constructor(
    private readonly firestoreService: FirestoreService,
    private sessionService: SessionService,
    private router: Router
  ) {
    
    this.load();
    this.init();
   
    //Profs
    this.getProf();
    //Students
    this.getStudent();
     //Tareas
     this.getTarea();

  }
  
  // Método para guardar los datos del profesor
  init(){

    //Miro que admin ha iniciado sesion
    const user = this.sessionService.getCurrentUser();

  if (user && 'Administrativo' in user && user.Administrativo) {
    this.userActual = user as ProfI;
    console.log('Administrador loggeado:', this.userActual.Nombre);
  } else {
    console.error('El usuario actual no es válido o no tiene permisos de administrador.');
    this.router.navigate(['/loginprofesor']); // Redirigir al login de administrador
    return; // Detenemos la ejecución si el usuario no es válido
  }

    // Inicializa los objetos de profesor, estudiante y tarea
    this.newProf = {
      Nombre: null,
      Edad: null,
      id: this.firestoreService.createIDDoc(),
      Password:null,
      Administrativo: false
    }

    this.newStud = {
      id: this.firestoreService.createIDDoc(),
      nombre: null,
      edad: null,
      password:null,
      TipoDiscapacidad: null,
    }
    
    this.newTarea = { 
      id: this.firestoreService.createIDDoc(),
      Nombre: null,
      Completada: null,
      Fecha: null,
      Asignado: null,
      Tipo: null,
      enlace: null,
    }
  }

  // Método para cargar los datos de la base de datos
  load(){
    // Carga los profesores de la base de datos
    this.firestoreService.getCollectionChanges<ProfI>('Profesores').subscribe((data) => {
      if (data) {
        this.profs = data;
      }
    });  

    // Carga las tareas de la base de datos
    this.firestoreService.getCollectionChanges<TareaI>('Tareas').subscribe((data) => {
      if (data) {
        this.tareas = data;
        console.log('tareas -> ', this.tareas);
      }
    });

    // Carga los estudiantes de la base de datos
    this.firestoreService.getCollectionChanges<UserI>('Usuarios').subscribe((data) => {
      if (data) {
        this.students = data;
      }
    });
    
  }

  // GETTERS
  // Método para obtener un profesor de la base de datos
  async getProf(){
    const res = await this.firestoreService.getDocument<ProfI>('Profesores/'+ this.newProf.id);
    this.prof = res.data();
  }

  // Método para obtener un estudiante de la base de datos
  async getStudent(){
    const res = await this.firestoreService.getDocument<UserI>('Usuarios/'+ this.newStud.id);
    this.stud = res.data();
  }

  // Método para obtener una tarea de la base de datos
  async getTarea(){
    const res = await this.firestoreService.getDocument<TareaI>('Tareas/'+ this.newTarea.id);
    this.tarea = res.data();
  }

  // Método para obtener un estudiante de una tarea
  async getStudentFromTarea(tarea: TareaI) {
    if (tarea.Asignado) {
      const userPath = tarea.Asignado.path;
      const usuario = await this.firestoreService.getDocument<UserI>(userPath);
      console.log('Usuario asignado:', usuario);
    }
  }

  confirmarFecha() {
    if (this.tempFecha) {
      this.newTarea.Fecha = Timestamp.fromDate(new Date(this.tempFecha)); // Asigna la fecha confirmada al modelo
      console.log('Fecha confirmada:', this.newTarea.Fecha);
    }
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~Profesor section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir un nuevo profesor a la base de datos (profesor no existente en la BD)
  async addprof(){
    this.newProf.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newProf, 'Profesores', this.newProf.id);
  }
  
  // Método para guardar nuevos datos de un profesor (ya existente) en la base de datos
  async saveProf(){
    await this.firestoreService.createDocumentID(this.newProf, 'Profesores', this.newProf.id);
  }
  
 // Método para editar un profesor
  editProf(prof: ProfI){
    console.log('edit -> ', prof);
    this.newProf = prof;
  }

  // Método para eliminar un profesor de la base de datos
  async deleteProf(prof: ProfI){
    console.log('delete -> ',prof.id);
    await this.firestoreService.deleteDocumentID('Profesores', prof.id);
  }




  //~~~~~~~~~~~~~~~~~~~~~~~~~Student section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir un nuevo estudiante a la base de datos (estudiante no existente en la BD)
  async addStud(){
    this.newProf.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newStud, 'Usuarios', this.newStud.id);
  }

  // Método para guardar nuevos datos de un estudiante (ya existente) en la base de datos
  async saveStudent(){
    await this.firestoreService.createDocumentID(this.newStud, 'Usuarios', this.newStud.id);
  }

  // Método para editar un estudiante
  editStu(student: UserI){
    console.log('edit -> ', student);
    this.newStud = student;
  }

  // Método para eliminar un estudiante de la base de datos
  async deleteStu(student: UserI){
    console.log('delete -> ', student.id);
    await this.firestoreService.deleteDocumentID('Usuarios', student.id);
  }

  
  
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~Tarea section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir una nueva tarea a la base de datos (tarea no existente en la BD)
  async addTarea(){
    await this.firestoreService.createDocumentID(this.newTarea, 'Tareas', this.newTarea.id);
    this.showForm = false;  // Oculta el formulario después de guardar
    this.cleanInterfaceTarea();
   }

   // Método para limpiar la interfaz de nueva tarea
   cleanInterfaceTarea(){ 
    this.newTarea.Nombre = this.newTarea.Asignado = 
    this.newTarea.Completada = this.newTarea.Fecha = null;
  }
  
  // Método para guardar nuevos datos de una tarea (ya existente) en la base de datos
  async saveTarea() {    
  
    //Si se ha seleccionado un estudiante, se asigna la tarea a ese estudiante
    if (this.selectedStudent) {
      this.newTarea.Asignado = doc(this.firestoreService.firestore, 'Usuarios', this.selectedStudent.id);
    }
    // Guardamos la tarea (con o sin el estudiante) en la base de datos
    await this.firestoreService.createDocumentID(this.newTarea, 'Tareas', this.newTarea.id); 
  }


 // Método para eliminar una tarea de la base de datos
  async deleteTarea(tarea: TareaI){
    console.log('delete -> ', tarea.id);
    await this.firestoreService.deleteDocumentID('Tareas', tarea.id);
  }

  // Método para editar una tarea
  editTarea(tarea: TareaI){
    console.log('edit -> ', tarea);
    this.newTarea = tarea;  
  }
   
 
  // Método para mostrar y ocultar el formulario de tarea
  toggleForm() {
    console.log('toggleForm activated');
    this.showForm = !this.showForm;
  } 

  // ChangePassword() {
  //   this.navCtrl.navigateForward('/change-password');
  // }


}
