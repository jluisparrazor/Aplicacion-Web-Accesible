import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonImg } from '@ionic/angular/standalone';
import { StudentI } from 'src/app/common/models/student.models';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';
import { Timestamp } from '@angular/fire/firestore';
import { CelebracionComponent } from "../../../shared/celebracion/celebracion.component";
import { AnimationService } from 'src/app/common/services/animation.service';

@Component({
  selector: 'app-tareas-aplicacion-juego',
  templateUrl: './tareas-aplicacion-juego.page.html',
  styleUrls: ['./tareas-aplicacion-juego.page.scss'],
  standalone: true,
  imports: [IonImg, IonAvatar, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule, CelebracionComponent]
})
export class TareasAplicacionJuegoPage implements OnInit {
  @ViewChild(CelebracionComponent) celebracionComponent!: CelebracionComponent;

  tareaCompletada: boolean = false;
  mostrarConfeti: boolean = false;
  userActual: StudentI;

  tarea: TaskI;
  descripcion: DescriptionI;

  enlaceVisitado = false;

  //Cosas pasadas por state
  taskID: string;
  taskTitle: string;
  associatedDescriptionId: string;
  estadoTarea: boolean[] = []; // Ahora es un array de booleanos

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private firestoreService: FirestoreService,
    private tasksService: TasksService,
    private animationService: AnimationService
  ) { }

  ngOnInit() {
    // Obtener los datos de la tarea pasada como parámetro
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.taskID = navigation.extras.state['taskID'];
      this.taskTitle = navigation.extras.state['taskTitle'];
      this.associatedDescriptionId = navigation.extras.state['associatedDescriptionId'];
      this.estadoTarea = navigation.extras.state['completed'];
  
      // Cargar la descripción asociada desde Firestore
      if (this.associatedDescriptionId) {
        this.loadDescripcion(this.associatedDescriptionId);
      }
  
      // Cargar la tarea desde Firestore usando taskID
      this.loadTarea(this.taskID);
    }
  
    const user = this.sessionService.getCurrentUser();
  
    if (user && 'correctPassword' in user) {
      this.userActual = user as unknown as StudentI;
      console.log('Usuario loggeado:', this.userActual.name);
    } else {
      console.error('El usuario actual no es válido o no es un StudentI.');
      this.router.navigate(['/loginalumno']);
    }

    console.log('Tarea seleccionada:', this.taskTitle);
    console.log('ID de la descripción asociada:', this.associatedDescriptionId);
    console.log('Estado de la tarea para ', user.name, ': ', this.estadoTarea);
  }  

  async loadTarea(taskID: string) {
    try {
      // Cargar la tarea desde Firestore usando taskID
      const tareaDoc = await this.firestoreService.getDocument<TaskI>(`Tasks/${taskID}`);
      this.tarea = tareaDoc.data();  // Ahora tenemos la tarea completa
      console.log('Tarea cargada:', this.tarea);
  
      // Obtener el ID del estudiante logueado
      const userId = this.userActual.id;  // ID del estudiante logueado

      // Buscar el alumno en el array 'assigned' usando el ID del estudiante
      const assignedStudent = this.tarea.assigned.find(assignment => assignment.assignedId === userId);  // Compara por ID del alumno

      // Buscar el índice del alumno en el array 'assigned' usando el ID del estudiante
      const studentIndex = this.tarea.assigned.findIndex(assignment => assignment.assignedId === userId);  // Compara por ID del alumno
  
      if (studentIndex !== -1) {
        // El alumno está asignado a la tarea
        console.log(`El estudiante ${assignedStudent.assignedName} sí está asignado a esta tarea.`);
      } else {
        console.log(`El estudiante ${assignedStudent.assignedName} no está asignado a esta tarea.`);
      }
    } catch (error) {
      console.error('Error al cargar la tarea:', error);
    }
  }
    
  // Método para cargar la descripción asociada
  async loadDescripcion(associatedDescriptionId: string) {
    try {
      const descriptionDoc = await this.firestoreService.getDocument<DescriptionI>(`Description/${associatedDescriptionId}`);
      this.descripcion = descriptionDoc.data();
      console.log('Descripción cargada:', this.descripcion);
    } catch (error) {
      console.error('Error al cargar la descripción:', error);
    }
  }  
  
  // Función para volver al listado de tareas
  volverListado() {
    this.router.navigate(['/tareasdiarioalumno']); // Aquí va la ruta a la página del listado
  }

  completarTarea() {
    const assignedId = this.userActual.id;  // ID del alumno logueado
    const studentIndex = this.tarea.assigned.findIndex(assignment => assignment.assignedId === assignedId);
  
    if (studentIndex !== -1) {
      // Marcamos la tarea como completada para este alumno
      this.tarea.assigned[studentIndex].completed = true;  // Marca como completada
      this.tarea.assigned[studentIndex].doneTime = Timestamp.now();  // Marca la fecha de finalización
      this.tareaCompletada = true;
  
  
      // Actualiza la tarea en el servicio de Firestore pasando el ID del alumno
      this.tasksService.actualizarTarea(this.tarea, assignedId).then(() => {
        console.log('Tarea actualizada a completada:', this.tarea);
      }).catch(error => {
        console.error('Error actualizando tarea:', error);
      });

      this.animationService.activarAnimacion('/tareasdiarioalumno', true);

    } else {
      console.error('El estudiante no está asignado a esta tarea.');
    }
  }  
  
  marcarEnlaceVisitado(){
    this.enlaceVisitado = true;
  }
}