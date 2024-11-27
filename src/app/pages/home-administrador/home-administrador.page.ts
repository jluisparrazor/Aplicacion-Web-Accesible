import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeacherI } from '../../common/models/teacher.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { StudentI } from '../../common/models/student.models';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { TareaI } from 'src/app/common/models/tarea.models';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
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
  
  teachers: TeacherI[] = [];
  newTeacher: TeacherI;
  teacher: TeacherI;

  students: StudentI[] = [];
  newStud: StudentI;
  stud: StudentI;

  tasks: TareaI[] = [];
  newTarea: TareaI;
  tarea: TareaI;
  selectedStudent: StudentI; // Estudiante al que se asignará la tarea

  userActual: TeacherI;

  showTaskForm: boolean = false;
  showStudentForm: boolean = false;
  showTeacherForm: boolean = false; 


  constructor(
    private readonly firestoreService: FirestoreService,
    private sessionService: SessionService,
    private router: Router
  ) {
    
    this.load();
    this.init();
   
    //Profs
    this.getTeacher();
    //Students
    this.getStudent();
     //Tareas
     this.getTarea();

  }
 
  init(){

    //Miro que admin ha iniciado sesion
    const user = this.sessionService.getCurrentUser();
    
    // MODO SÓLO DE PRUEBA ID DE PAULA (ADMIN)
    // const profId = "e1873ba9-8853-44c4-8fd3-4469d7cadb91";
    // const user =  await this.firestoreService.getDocument<TeacherI>(`Teachers/${profId}`)


  if (user && 'administrative' in user) {
  // if(true){
    this.userActual = user as unknown as TeacherI;
    console.log('Administrador loggeado:', this.userActual.name);
  } else {
    console.error('El usuario actual no es válido o no tiene permisos de administrador.');
    this.router.navigate(['/loginprofesor']); // Redirigir al login de administrador
    return; // Detenemos la ejecución si el usuario no es válido
  }

    // Inicializa los objetos de profesor, estudiante y tarea
    this.newTeacher = {
      id: null,
      name: null,
      surname: null,
      password: null,
      dni:null,
      administrative: false,
      pictogramId: null,
      email: null,
      birthdate: null,
      phone: null,
      personalData: null,
    }

    this.newStud = {
      id: this.firestoreService.createIDDoc(),
      name: null,
      surname: null,
      dni: null,
      pictogramId: null,
      phone: null,
      personalData: null,
      birthDate: null,
      disabilities: {
        visual: false,
        auditory: false,
        motor: false,
        cognitive: false,
      },
      loginType: false,
      correctPassword: null,
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
    this.firestoreService.getCollectionChanges<TeacherI>('Teachers').subscribe((data) => {
      if (data) {
        this.teachers = data;
      }
    });  

    // Carga las tasks de la base de datos
    this.firestoreService.getCollectionChanges<TareaI>('Tareas').subscribe((data) => {
      if (data) {
        this.tasks = data;
        console.log('tasks -> ', this.tasks);
      }
    });

    // Carga los estudiantes de la base de datos
    this.firestoreService.getCollectionChanges<StudentI>('Students').subscribe((data) => {
      if (data) {
        this.students = data;
      }
    });
    
  }

  // GETTERS
  // Método para obtener un profesor de la base de datos
  async getTeacher(){
    const res = await this.firestoreService.getDocument<TeacherI>('Teachers/'+ this.newTeacher.id);
    this.teacher = res.data();
    console.log('Profesor:', this.teacher);
  }

  // Método para obtener un estudiante de la base de datos
  async getStudent(){
    const res = await this.firestoreService.getDocument<StudentI>('Students/'+ this.newStud.id);
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
      const usuario = await this.firestoreService.getDocument<StudentI>(userPath);
      console.log('Usuario asignado:', usuario);
    }
  }

  
    
  //~~~~~~~~~~~~~~~~~~~~~~~~~Profesor section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir un nuevo profesor a la base de datos (profesor no existente en la BD)
  // async addTeacher(){
  //   this.newTeacher.id = this.firestoreService.createIDDoc();
  //   await this.firestoreService.createDocumentID(this.newTeacher, 'Teachers', this.newTeacher.id);
  //   console.log("Nuevo profesor ->", this.newTeacher);
  //   alert("Profesor añadido con éxito!");
  //   this.showTeacherForm = false;  // Oculta el formulario después de guardar
  // }
  
  // // Método para guardar nuevos datos de un profesor (ya existente) en la base de datos
  // async saveTeacher(){
  //   await this.firestoreService.createDocumentID(this.newTeacher, 'Teachers', this.newTeacher.id);
  // }


  // Método para añadir o actualizar un profesor según el DNI
async addTeacher() {
    this.newTeacher.id = this.firestoreService.createIDDoc();

    await this.firestoreService.createDocumentID(this.newTeacher, 'Teachers', this.newTeacher.id);
    console.log("Nuevo profesor ->", this.newTeacher);
    alert("Profesor añadido con éxito.");
    this.showTeacherForm = false;
  // Limpiar el formulario y ocultar
  this.cleanInterfaceTeacher();
}

cleanInterfaceTeacher(){ 
  for (const key in this.newTeacher) {
    if (this.newTeacher.hasOwnProperty(key)) {
      (this.newTeacher as any)[key] = null;
    }
  }
}
  
 // Método para editar un profesor
  editTeacher(teacher: TeacherI){
    console.log('edit -> ', teacher);
    this.newTeacher = teacher;
  }

  // Método para eliminar un profesor de la base de datos
  async deleteTeacher(teacher: TeacherI){
    console.log('delete -> ',teacher.id);
    await this.firestoreService.deleteDocumentID('Teachers', teacher.id);
  }




  //~~~~~~~~~~~~~~~~~~~~~~~~~Student section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir un nuevo estudiante a la base de datos (estudiante no existente en la BD)
  async addStud(){
    // Hacer comprobación para que al menos estén rellenos los campos obligatorios
    this.newStud.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newStud, 'Students', this.newStud.id);
    this.showStudentForm = false;  // Oculta el formulario después de guardar
    this.cleanInterfaceStud();

 
  }
   // Método para limpiar la interfaz de nueva tarea
   cleanInterfaceStud(){ 
      for (const key in this.newStud) {
        if (this.newStud.hasOwnProperty(key)) {
          (this.newStud as any)[key] = null;
        }
      }
    }
      
  // Método para guardar nuevos datos de un estudiante (ya existente) en la base de datos
  async saveStudent(){
    await this.firestoreService.createDocumentID(this.newStud, 'Students', this.newStud.id);
  }

  // Método para editar un estudiante
  editStu(student: StudentI){
    console.log('edit -> ', student);
    this.newStud = student;
  }

  // Método para eliminar un estudiante de la base de datos
  async deleteStu(student: StudentI){
    console.log('delete -> ', student.id);
    await this.firestoreService.deleteDocumentID('Students', student.id);
  }

  
  
  
  //~~~~~~~~~~~~~~~~~~~~~~~~~Tarea section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir una nueva tarea a la base de datos (tarea no existente en la BD)
  async addTarea(){
    this.newTarea.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newTarea, 'Tareas', this.newTarea.id);
    this.showTaskForm = false;  // Oculta el formulario después de guardar
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
      this.newTarea.Asignado = doc(this.firestoreService.firestore, 'Students', this.selectedStudent.id);
    }
    // Guardamos la tarea (con o sin el estudiante) en la base de datos
    await this.firestoreService.createDocumentID(this.newTarea, 'Tareas', this.newTarea.id); 
  }

  cleanInterfaceTask(){ 
    for (const key in this.newTarea) {
      if (this.newTarea.hasOwnProperty(key)) {
        (this.newTarea as any)[key] = null;
      }
    }
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
  
  confirmarFecha() {
    if (this.tempFecha) {
      this.newTarea.Fecha = Timestamp.fromDate(new Date(this.tempFecha)); // Asigna la fecha confirmada al modelo
      console.log('Fecha confirmada:', this.newTarea.Fecha);
    }
  }
 
  // Métodos para mostrar y ocultar el formulario de tarea, alumnos y profesores
  toggleTaskForm() {
    console.log('toggleTaskForm activated');
    this.showTaskForm = !this.showTaskForm;
  } 

  toggleStudentForm() {
      console.log('toggleStudentForm activated');
      this.showStudentForm = !this.showStudentForm;
  }

  toggleTeacherForm() {
    console.log('toggleTeacherForm activated');
    this.showTeacherForm = !this.showTeacherForm;
  }

  // ChangePassword() {
  //   this.navCtrl.navigateForward('/change-password');
  // }


}


