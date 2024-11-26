import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeacherI } from '../../common/models/teacher.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { StudentI } from '../../common/models/student.models';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { TareaI } from 'src/app/common/models/tarea.models';
import { doc, Timestamp } from 'firebase/firestore';
import { RouterModule } from '@angular/router';

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

  showTaskForm: boolean = false;
  showStudentForm: boolean = false;
  showTeacherForm: boolean = false; 


  constructor(private readonly firestoreService: FirestoreService) {
    
    this.load();
    this.init();
   
    //Profs
    this.getTeacher();
    //Students
    this.getStudent();
     //Tareas
     this.getTarea();

  }
  // ngOnInit(): void {
  //   // Cargar solo los íconos que se usan en esta página
  //   this.ionicons.init([
  //     'calendarOutline',
  //     'addCircleOutline',
  //     'create',
  //     'trash',
  // ]);
  
  
  // Método para guardar los datos del profesor
  init(){
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
      pictogramId: null,
      phone: null,
      personalData: null,
      birthDate: null,
      profileType: false,
      loginType: false,
    }
    
    this.newTarea = { 
      id: this.firestoreService.createIDDoc(),
      Nombre: null,
      Completada: null,
      Fecha: null,
      Asignado: null,
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

  confirmarFecha() {
    if (this.tempFecha) {
      this.newTarea.Fecha = Timestamp.fromDate(new Date(this.tempFecha)); // Asigna la fecha confirmada al modelo
      console.log('Fecha confirmada:', this.newTarea.Fecha);
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
async addOrUpdateTeacher() {
  // if (!this.newTeacher.dni) {
  //   alert("Por favor, ingresa un DNI válido.");
  //   return;
  // }

  // // Buscar si existe un profesor con el DNI propuesto
  // const existingTeacher = this.teachers.find(teacher => teacher.dni === this.newTeacher.dni);

  // if (existingTeacher) {
  //   // Si el profesor existe, actualizar los datos
  //   this.newTeacher.id = existingTeacher.id; // Usar el mismo ID del profesor existente
  //   this.getTeacher();
  //   console.log("Profesor actualizado ->", this.newTeacher);
  //   alert("Datos del profesor actualizados con éxito.");
  // }
  // else {
    // Si el profesor no existe, crear uno nuevo
    this.newTeacher.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newTeacher, 'Teachers', this.newTeacher.id);
    console.log("Nuevo profesor ->", this.newTeacher);
    alert("Profesor añadido con éxito.");
  // }

  // Limpiar el formulario y ocultar
  this.resetTeacherForm();
  this.showTeacherForm = false;
}

resetTeacherForm() {
  this.newTeacher = {
    id: null,
    name: null,
    surname: null,
    dni: null,
    password: null,
    administrative: false,
    pictogramId: null,
    email: null,
    birthdate: null,
    phone: null,
    personalData: null,
  };
}
  
 // Método para editar un profesor
  editTeacher(prof: TeacherI){
    console.log('edit -> ', prof);
    this.newTeacher = prof;
  }

  // Método para eliminar un profesor de la base de datos
  async deleteTeacher(prof: TeacherI){
    console.log('delete -> ',prof.id);
    await this.firestoreService.deleteDocumentID('Teachers', prof.id);
  }




  //~~~~~~~~~~~~~~~~~~~~~~~~~Student section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir un nuevo estudiante a la base de datos (estudiante no existente en la BD)
  async addStud(){
    this.newStud.id = this.firestoreService.createIDDoc();
    await this.firestoreService.createDocumentID(this.newStud, 'Students', this.newStud.id);
    this.showStudentForm = false;  // Oculta el formulario después de guardar

  }
   // Método para limpiar la interfaz de nueva tarea
   cleanInterfaceStud(){ 
      for (const key in this.newStud) {
        if (this.newStud.hasOwnProperty(key) && key !== 'id') {
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
