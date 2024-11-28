import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeacherI } from '../../common/models/teacher.models';
import { FirestoreService } from '../../common/services/firestore.service';
import { StudentI } from '../../common/models/student.models';
import { TasksService } from 'src/app/common/services/tasks.service';
import { getDoc } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { DescriptionI, TaskI } from 'src/app/common/models/task.models';
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

  tempFechaInicio: any = null;
  tempFechaCumplimiento: any = null;
  
  teachers: TeacherI[] = [];
  newTeacher: TeacherI;
  teacher: TeacherI;

  students: StudentI[] = [];
  newStud: StudentI;
  stud: StudentI;

  tasks: TaskI[] = [];
  newTarea: TaskI;
  tarea: TaskI;

  tasksDescriptions: DescriptionI[] = [];
  newTaskDescription: DescriptionI;
  description: DescriptionI;
  
  selectedStudent: StudentI; // Estudiante al que se asignará la tarea
  //selectedStudent: UserI; // Estudiante al que se asignará la tarea

 // userActual: ProfI;


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

  if (user && 'administrative' in user && user.administrative) {
    this.userActual = user as TeacherI;
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
      //id_pictogram: null,
      //correctPassword: null,
    }

    this.newTaskDescription = {
      title: null,
      descriptionId: null,
      imagesId: null,
      pictogramsId: null,
      text: null,
      link: null
    }
    
    this.newTarea = { 
      taskID: this.firestoreService.createIDDoc(),
      startTime: null,
      endTime: null,
      doneTime: null,
      type: null,
      completed: null,
      assigned: null,
      associatedDescriptionId: null,
      descriptionData: null
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

    // Carga las descripciones de la base de datos
    this.firestoreService.getCollectionChanges<DescriptionI>('Description').subscribe((data) => {
      if (data) {
        this.tasksDescriptions = data;
      }
    });

    // Cargar las tareas desde Firestore
    this.firestoreService.getCollectionChanges<TaskI>('Tasks').subscribe(async (data) => {
      if (data) {
        this.tasks = data;

        // Usamos Promise.all para obtener todas las descripciones en paralelo
        await Promise.all(this.tasks.map(async (task) => {
          try {
            // Usamos associatedDescriptionId para buscar el documento de descripción
            const descriptionDocRef = doc(this.firestoreService.firestore, 'Description', task.associatedDescriptionId);
            const descriptionDoc = await getDoc(descriptionDocRef);

            if (descriptionDoc.exists()) {
              // Accedemos a los datos de la descripción sin cambiar la referencia
              task['descriptionData'] = descriptionDoc.data() as DescriptionI; // Guardamos los datos en un campo temporal 'descriptionData'
            }
          } catch (error) {
            console.error(`Error fetching description for task ${task.associatedDescriptionId}:`, error);
          }
        }));

        // Ahora tienes las tareas con las descripciones cargadas
        console.log('tasks with descriptions -> ', this.tasks);
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
    const res = await this.firestoreService.getDocument<TaskI>('Tasks/'+ this.newTarea.taskID);
    this.tarea = res.data();
  }

  // Método para obtener una descripcion de la base de datos
  async getDescripcion(){
    const res = await this.firestoreService.getDocument<DescriptionI>('Description/'+ this.newTaskDescription.descriptionId);
    this.description = res.data();
  }

  // Método para obtener un estudiante de una tarea
  async getStudentFromTarea(tarea: TaskI) {
    if (tarea.assigned) {
      const userPath = tarea.assigned.path;
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
    this.newTarea.taskID = this.firestoreService.createIDDoc();
    this.newTarea.completed = false;
    this.newTaskDescription.descriptionId = this.firestoreService.createIDDoc();

    //Creo la descripcion en la bd
    await this.firestoreService.createDocumentID(this.newTaskDescription, 'Description', this.newTaskDescription.descriptionId);

    //Asocio esa descripcion a la tarea, usando la variable description  tipo Reference
    const descriptionRef = this.firestoreService.getDocumentReference('Description', this.newTaskDescription.descriptionId);
    this.newTarea.associatedDescriptionId = this.newTaskDescription.descriptionId;
    
    //Creo la tarea en la bd
    await this.firestoreService.createDocumentID(this.newTarea, 'Tasks', this.newTarea.taskID);

    this.showTaskForm = false;
    this.cleanInterfaceTarea();
  }

  // Método para limpiar la interfaz de nueva tarea
  cleanInterfaceTarea(){ 
    this.newTarea.startTime = null;
    this.newTarea.endTime = null;
    this.newTarea.type = null;
    this.newTarea.completed = null;
    this.newTarea.assigned = null;
    this.newTaskDescription.title = null;
    this.newTaskDescription.text = null;
    this.newTaskDescription.link = null;
  }
  
  // Método para guardar nuevos datos de una tarea (ya existente) en la base de datos
  async saveTarea() {
  
    //Si se ha seleccionado un estudiante, se asigna la tarea a ese estudiante
    if (this.selectedStudent) {
      this.newTarea.assigned = doc(this.firestoreService.firestore, 'Students', this.selectedStudent.id);
    }
    // Guardamos la tarea (con o sin el estudiante) en la base de datos
    await this.firestoreService.createDocumentID(this.newTarea, 'Tareas', this.newTarea.taskID); 
  }

 // Método para eliminar una tarea de la base de datos
 async deleteTarea(tarea: TaskI) {
  console.log('delete -> ', tarea.taskID);

  try {
    // Eliminar la tarea
    await this.firestoreService.deleteDocumentID('Tasks', tarea.taskID);

    // Eliminar la descripción asociada
    if (tarea.associatedDescriptionId) {
      console.log('Eliminando la descripción asociada con ID: ', tarea.associatedDescriptionId);
      await this.firestoreService.deleteDocumentID('Description', tarea.associatedDescriptionId);
    }
  } catch (error) {
    console.error('Error al eliminar la tarea o la descripción:', error);
  }
}


  // Método para editar una tarea
  editTarea(tarea: TaskI){
    console.log('edit -> ', tarea);
    this.newTarea = tarea;  
  }

  //Fechas tareas
  // Función para confirmar la fecha de inicio
  confirmarFechaInicio() {
    if (this.tempFechaInicio) {
      this.newTarea.startTime = Timestamp.fromDate(new Date(this.tempFechaInicio)); // Asigna la fecha de inicio al modelo
      console.log('Fecha de inicio confirmada:', this.newTarea.startTime);
    }
  }
  
  // Función para confirmar la fecha de cumplimiento
  confirmarFechaCumplimiento() {
    if (this.tempFechaCumplimiento) {
      this.newTarea.endTime = Timestamp.fromDate(new Date(this.tempFechaCumplimiento)); // Asigna la fecha de cumplimiento al modelo
      console.log('Fecha de cumplimiento confirmada:', this.newTarea.endTime);
    }
  }

  // Funciones de reset
  resetFechaInicio(datetime: any) {
    this.tempFechaInicio = null; // Resetea la fecha de inicio
    datetime.reset(); // Resetea el componente de fecha
  }

  resetFechaCumplimiento(datetime: any) {
    this.tempFechaCumplimiento = null; // Resetea la fecha de cumplimiento
    datetime.reset(); // Resetea el componente de fecha
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


