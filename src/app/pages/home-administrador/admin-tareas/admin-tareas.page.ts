import { Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeacherI } from 'src/app/common/models/teacher.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { StudentI } from 'src/app/common/models/student.models';
import { getDoc, setDoc } from 'firebase/firestore';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DescriptionI, TaskI } from 'src/app/common/models/task.models';
import { doc, Timestamp } from 'firebase/firestore';
import { RouterModule } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/common/services/teacher.service';
import { StudentService } from 'src/app/common/services/student.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { PictogramSearchComponent } from 'src/app/shared/pictogram-search/pictogram-search.component';
import { AlertController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEs);

@Component({
  selector: 'app-admin-administrador',
  templateUrl: './admin-tareas.page.html',
  styleUrls: ['./admin-tareas.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, PictogramSearchComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})


export class AdminTareasPage{
  //Esto lo uso para cuando edito tarea, que scrollee hasta arriba del todo
  @ViewChild(IonContent, { static: false }) content: IonContent;

  //Profesores
  teachers: TeacherI[] = [];
  newTeacher: TeacherI;
  teacher: TeacherI;

  userActual: TeacherI;

  //Alumnos
  students: StudentI[] = [];
  newStud: StudentI;
  stud: StudentI;

  selectedStudent: StudentI; // Estudiante al que se asignará la tarea

  //Tareas
  tasks: TaskI[] = [];
  newTarea: TaskI;
  tareaVacia: TaskI;
  tarea: TaskI;
  selectedTask: TaskI | null = null; // Tarea seleccionada en el formulario
  editedTask: TaskI | null = null;   // Tarea seleccionada para editar
  originalAssigned: string[] = [];

  tasksWithAssignment: any[] = [];
  tasksWithoutAssignment: any[] = [];

  tempFechaInicio: any = null;
  tempFechaCumplimiento: any = null;

  newImageLink: string = '';

  //Descripciones
  tasksDescriptions: DescriptionI[] = [];
  newTaskDescription: DescriptionI;
  description: DescriptionI;
  
  //Formularios
  showTaskForm: boolean = false;
  showAssignationsForm: boolean = false;
  showStudentForm: boolean = false;
  showTeacherForm: boolean = false; 

  //Subject
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
    private readonly taskService: TasksService,
    private alertController: AlertController
  ) {
    
    this.load();
    this.init();
   
    //Profs
    //Students
    this.getStudent();
     //Tareas
     this.getTarea();

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
  init(){

    //Miro que admin ha iniciado sesion
    const user = this.sessionService.getCurrentUser();

    // Inicializa los objetos de profesor, estudiante, tarea y descripcion de la tarea
    this.newTeacher = this.teacherService.initTeacher();

    this.newStud = this.studentService.initStudent();
    
    this.newTaskDescription = this.taskService.initTaskDescription();

    this.newTarea = this.taskService.initTask();  

    this.tareaVacia = this.taskService.initTask();
  }

  // Método para cargar los datos de la base de datos
  load(){
    // Descripciones de tareas
    this.firestoreService.getCollectionChanges<DescriptionI>('Description')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data) {
          this.tasksDescriptions = data;
        }
      });

      this.firestoreService.getCollectionChanges<TaskI>('Tasks')
  .pipe(takeUntil(this.unsubscribe$))
  .subscribe(async (data) => {
    if (data) {
      // Declaramos las variables con tipo explícito
      const tasksWithAssignment: TaskI[] = [];
      const tasksWithoutAssignment: TaskI[] = [];

      await Promise.all(data.map(async (task) => {
        try {
          const descriptionDocRef = doc(this.firestoreService.firestore, 'Description', task.associatedDescriptionId);
          const descriptionDoc = await getDoc(descriptionDocRef);

          if (descriptionDoc.exists()) {
            task['descriptionData'] = descriptionDoc.data() as DescriptionI;
          }
        } catch (error) {
          console.error(`Error fetching description for task ${task.associatedDescriptionId}:`, error);
        }

        if (task.assigned && task.assigned.length > 0) {
          tasksWithAssignment.push(task);
        } else {
          tasksWithoutAssignment.push(task);
        }
      }));

      // Actualizamos las listas con los resultados procesados
      this.tasksWithAssignment = tasksWithAssignment;
      this.tasksWithoutAssignment = tasksWithoutAssignment;

      console.log('Tareas con asignación: ', this.tasksWithAssignment);
      console.log('Tareas sin asignación: ', this.tasksWithoutAssignment);
    }
  });

    // Estudiantes
    this.firestoreService.getCollectionChanges<StudentI>('Students')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if (data) {
        this.students = data;
        console.log('Estudiantes -> ', this.students);
      }
    });

    // Profesores
    this.firestoreService.getCollectionChanges<TeacherI>('Teachers')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data) {
          this.teachers = data;
          console.log('Profesores -> ', this.teachers);
        }
      });
  }

  // GETTERS
  // Método para obtener un profesor de la base de datos

  // Método para obtener un estudiante de la base de datos
  getStudent(){
  //   const res = await this.firestoreService.getDocument<StudentI>('Students/'+ this.newStud.id);
  //   this.stud = res.data();
  this.studentService.getStudent(this.newStud.id).then((student) => {
    this.stud = student;
  });
  console.log('Estudiante:', this.stud);  
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
  async getStudentsFromTarea(tarea: TaskI) {
    if (tarea.assigned && tarea.assigned.length > 0) {
      for (const studentName of tarea.assigned) {
        // Aquí 'studentName' es el nombre completo (ej. "Laura Pérez")
        try {
          // Compara el nombre completo con el usuario logueado
          if (studentName === this.userActual.name) {
            // Si coincide, obtén los datos del estudiante desde Firestore
            const studentData = await this.firestoreService.getStudentByName(studentName);
            console.log('Estudiante asignado:', studentData);
          }
        } catch (error) {
          console.error('Error al obtener los datos del estudiante:', error);
        }
      }
    } else {
      console.log('No hay estudiantes asignados a esta tarea.');
    }
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~Tarea section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir una nueva tarea a la base de datos (tarea no existente en la BD)
  async addTarea(){
    this.newTarea.taskID = this.firestoreService.createIDDoc();
    this.newTarea.assigned = [];
    this.newTarea.completed = [];
    this.newTarea.doneTime = [];
    this.newTaskDescription.descriptionId = this.firestoreService.createIDDoc();

    // Asignar las fechas seleccionadas antes de crear la tarea
    if (this.tempFechaInicio) {
      this.newTarea.startTime = Timestamp.fromDate(new Date(this.tempFechaInicio));  // Asigna la fecha de inicio
    }

    if (this.tempFechaCumplimiento) {
      this.newTarea.endTime = Timestamp.fromDate(new Date(this.tempFechaCumplimiento));  // Asigna la fecha de cumplimiento
    }

    //Creo la descripcion en la bd
    await this.firestoreService.createDocumentID(this.newTaskDescription, 'Description', this.newTaskDescription.descriptionId);

    //Asocio esa descripcion a la tarea
    this.newTarea.associatedDescriptionId = this.newTaskDescription.descriptionId;
    
    //Creo la tarea en la bd
    await this.firestoreService.createDocumentID(this.newTarea, 'Tasks', this.newTarea.taskID);

    // Reseteo las variables temporales para las siguientes tareas
    this.tempFechaInicio = null;
    this.tempFechaCumplimiento = null;

    this.showTaskForm = false;
    this.cleanInterfaceTarea();
  }

  // Función que se llama cuando se selecciona una tarea
  onTaskSelect(task: any) {
    if (task) {
      // Guardar la tarea seleccionada
      this.selectedTask = task; // Asignar la tarea seleccionada a selectedTask
      console.log('Tarea seleccionada', this.selectedTask);
  
      // Guardar la lista de alumnos asignados inicialmente para comparaciones futuras
      this.originalAssigned = [...task.assigned]; // Copia profunda de la lista de asignados
      console.log('Alumnos asignados inicialmente:', this.originalAssigned);
    }
  }

  async assignTarea() {
    if (this.selectedTask) {
      // 1. Primero determinamos los cambios (antes de modificar los arrays)
    const removedStudents = this.originalAssigned.filter(student => !this.selectedTask.assigned.includes(student));
    const addedStudents = this.selectedTask.assigned.filter(student => !this.originalAssigned.includes(student));

    console.log('Estudiantes desasignados:', removedStudents);
    console.log('Estudiantes nuevos asignados:', addedStudents);

     // 2. Obtener los índices de los estudiantes desasignados en el array original
     const removedStudentsIndices = removedStudents.map(student => {
      return this.originalAssigned.indexOf(student);
    });

    console.log('Índices de los estudiantes desasignados:', removedStudentsIndices);

    // 3. Actualizar `completed` y `doneTime` usando los índices
    for (let i = this.originalAssigned.length - 1; i >= 0; i--) {
      if (removedStudentsIndices.includes(i)) {
        console.log(`Eliminando datos en la posición ${i} de completed y doneTime`);
        this.selectedTask.completed.splice(i, 1); // Eliminar estado de completado
        this.selectedTask.doneTime.splice(i, 1);  // Eliminar tiempo de finalización
      }
    }
  
    addedStudents.forEach(student => {
      console.log('Procesando estudiante:', student); // Asegurarse de que se entra en el ciclo
    
      if (!Array.isArray(this.selectedTask.completed)) {
        this.selectedTask.completed = [];
        console.log('Inicializando task.completed como array vacío');
      }
      if (!Array.isArray(this.selectedTask.doneTime)) {
        this.selectedTask.doneTime = [];
        console.log('Inicializando task.doneTime como array vacío');
      }
    
      console.log(`Asignando estudiante: ${student}`);
      this.selectedTask.completed.push(false);  // Añadimos estado de completado
      this.selectedTask.doneTime.push(null);    // Añadimos tiempo de finalización
    });
    
    try {
      // Guardar los cambios en la base de datos
      const taskRef = this.firestoreService.getDocumentReference('Tasks', this.selectedTask.taskID);
      await this.firestoreService.updateDocument(taskRef, {
        assigned: this.selectedTask.assigned,
        completed: this.selectedTask.completed,
        doneTime: this.selectedTask.doneTime,
      });
      console.log('Tarea actualizada exitosamente:', this.selectedTask);
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
    }
  
    // Limpieza del formulario
    this.selectedTask = null;
    this.toggleAssignationForm();
  }
}
  
  trackByTaskId(index: number, task: TaskI): string {
    return task.taskID;
  }

  // Método para limpiar la interfaz de nueva tarea
  cleanInterfaceTarea(){ 
    this.newTarea.title = null;
    this.newTarea.startTime = null;
    this.newTarea.endTime = null;
    this.newTarea.type = null;
    this.newTarea.completed = null;
    this.newTarea.assigned = null;
    this.newTaskDescription.text = null;
    this.newTaskDescription.link = null;
    this.newTaskDescription.pictogramId = null;
  }

 // Método para eliminar una tarea de la base de datos
 async deleteTarea(tarea: TaskI) {
  const alert = await this.alertController.create({
    header: 'Confirmar eliminación',
    message: `¿Estás seguro de que deseas eliminar la tarea "${tarea.title}"?`,
    buttons: [
      {
        text: 'No',
        role: 'cancel',
        cssClass: 'secondary',
        handler: () => {
          console.log('Eliminación cancelada');
        }
      },
      {
        text: 'Sí',
        handler: async () => {
          try {
            console.log('delete -> ', tarea.taskID);

            // Eliminar la tarea
            await this.firestoreService.deleteDocumentID('Tasks', tarea.taskID);

            // Eliminar la descripción asociada
            if (tarea.associatedDescriptionId) {
              console.log('Eliminando la descripción asociada con ID: ', tarea.associatedDescriptionId);
              await this.firestoreService.deleteDocumentID('Description', tarea.associatedDescriptionId);
            }

            console.log(`Tarea "${tarea.title}" eliminada correctamente`);
          } catch (error) {
            console.error('Error al eliminar la tarea o la descripción:', error);
          }
        }
      }
    ]
  });

  await alert.present();
}


  // Función para cargar la tarea seleccionada en el formulario de edición
  editTarea(tarea: TaskI) {
    console.log('edit -> ', tarea);
    this.editedTask = tarea;
  
    // Copia superficial de los valores
    this.newTarea = { ...tarea };
  
    // Convertir las fechas a formato ISO (necesario para ion-datetime)
    this.tempFechaInicio = tarea.startTime ? new Date(tarea.startTime.seconds * 1000).toISOString() : null;
    this.tempFechaCumplimiento = tarea.endTime ? new Date(tarea.endTime.seconds * 1000).toISOString() : null;
  
    // Cargar la descripción asociada
    if (tarea.associatedDescriptionId) {
      const descriptionDocRef = doc(this.firestoreService.firestore, 'Description', tarea.associatedDescriptionId);
      getDoc(descriptionDocRef).then(descriptionDoc => {
        if (descriptionDoc.exists()) {
          this.newTaskDescription = descriptionDoc.data() as DescriptionI;
        }
      });
    }

    // Mover la vista al principio de la página
    this.content.scrollToTop();  // Esto mueve la página al inicio
  
    this.showTaskForm = true; // Mostrar el formulario
  }  

  async saveTarea() {
    if (this.editedTask) {
      try {
        // Actualizar la descripción si es necesario
        if (this.newTaskDescription.descriptionId) {
          // Crear un objeto con los campos relevantes de la descripción
          const descripcion = {
            descriptionId: this.newTaskDescription.descriptionId,
            imagesId: this.newTaskDescription.imagesId,
            text: this.newTaskDescription.text,
            pictogramId: this.newTaskDescription.pictogramId,
            link: this.newTaskDescription.link
          };

          const descriptionRef = doc(this.firestoreService.firestore, 'Description', this.editedTask.associatedDescriptionId);
          await setDoc(descriptionRef, descripcion);  // Solo actualizamos los campos necesarios de la descripción
          console.log('Descripción actualizada correctamente');
        }

        // Validar y actualizar fechas si existen
        const updatedTask: Partial<TaskI> = {
          assigned: this.newTarea.assigned,
          associatedDescriptionId: this.editedTask.associatedDescriptionId,
          completed: this.newTarea.completed,
          descriptionData: this.tareaVacia.descriptionData,
          doneTime: this.newTarea.doneTime,
          taskID: this.newTarea.taskID,
          title: this.newTarea.title,
          type: this.newTarea.type
        };

        if (this.tempFechaInicio) {
          updatedTask.startTime = Timestamp.fromDate(new Date(this.tempFechaInicio));  // Asigna la fecha de inicio
        }
    
        if (this.tempFechaCumplimiento) {
          updatedTask.endTime = Timestamp.fromDate(new Date(this.tempFechaCumplimiento));  // Asigna la fecha de cumplimiento
        }

        console.log('STARTTIME', this.tempFechaInicio);
        console.log('ENDTIME', this.tempFechaCumplimiento);

        // Actualizar la tarea
        const taskRef = doc(this.firestoreService.firestore, 'Tasks', this.editedTask.taskID);
        await setDoc(taskRef, updatedTask); // Actualizamos la tarea principal

        console.log('Tarea actualizada correctamente');
        this.toggleTaskForm(); // Cerrar el formulario después de la edición

        // Vaciar la tarea editada después de guardarla
        this.editedTask = null;
        this.newTarea = this.taskService.initTask();
        this.newTaskDescription = this.taskService.initTaskDescription();
        this.resetFechaInicio();
        this.resetFechaCumplimiento();

      } catch (error) {
        console.error('Error al actualizar la tarea:', error);
      }
    }
  }

  // Este método se ejecuta cuando cambia la fecha de inicio
  onFechaInicioChange(event: any) {
    this.tempFechaInicio = event.detail.value;
  }

  // Este método se ejecuta cuando cambia la fecha de cumplimiento
  onFechaCumplimientoChange(event: any) {
    this.tempFechaCumplimiento = event.detail.value;
  }

  //Resets
  resetFechaInicio() {
    this.tempFechaInicio = null;
    console.log('Fecha de inicio reseteada');
  }
  
  resetFechaCumplimiento() {
    this.tempFechaCumplimiento = null;
    console.log('Fecha de cumplimiento reseteada');
  }
  
  // Métodos para mostrar y ocultar el formulario de tarea, alumnos y profesores
  toggleTaskForm() {
    console.log('toggleTaskForm activated');
    this.showTaskForm = !this.showTaskForm;

    // Vaciar la tarea editada si se cancela el formulario
    if (!this.showTaskForm) {
      this.editedTask = null;
      this.newTarea = this.taskService.initTask();
      this.newTaskDescription = this.taskService.initTaskDescription();
    }
  } 

  // Métodos para mostrar y ocultar el formulario de tarea, alumnos y profesores
  toggleAssignationForm() {
    console.log('toggleAssignationForm activated');
    this.showAssignationsForm = !this.showAssignationsForm;
  }
  
  addImage() {
    if (this.newImageLink.trim() !== '') {
      if (!this.newTaskDescription.imagesId) {
        this.newTaskDescription.imagesId = [];
      }
      this.newTaskDescription.imagesId.push(this.newImageLink.trim());
      this.newImageLink = ''; // Limpiar el campo de entrada después de añadir la imagen
    }
  }
  
  removeImage(imageId: string) {
    if (this.newTaskDescription.imagesId) {
      const index = this.newTaskDescription.imagesId.indexOf(imageId);
      if (index > -1) {
        this.newTaskDescription.imagesId.splice(index, 1);
      }
    }
  }

  comeback(){
    this.router.navigate(['/homeadministrador']);
  }
}