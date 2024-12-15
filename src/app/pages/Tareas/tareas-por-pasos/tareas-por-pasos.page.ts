import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonImg, IonGrid, IonRow, IonCol, IonCard } from '@ionic/angular/standalone';
import { StudentI } from 'src/app/common/models/student.models';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';
import { Timestamp } from '@angular/fire/firestore';
import { CelebracionComponent } from "../../../shared/celebracion/celebracion.component";

@Component({
  selector: 'app-tareas-por-pasos',
  templateUrl: './tareas-por-pasos.page.html',
  styleUrls: ['./tareas-por-pasos.page.scss'],
  standalone: true,
  imports: [IonCard, IonCol, IonRow, IonGrid, IonImg, IonAvatar, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule, CelebracionComponent]
})
export class TareasPorPasosPage implements OnInit {

  tareaCompletada: boolean = false;
  mostrarConfeti: boolean = false;
  userActual: StudentI;

  tarea: TaskI;
  descripcion: DescriptionI;

  enlaceVisitado = false;

  //Cosas pasadas por state
  taskID: string;
  associatedDescriptionId: string;
  estadoTarea: boolean[] = []; // Ahora es un array de booleanos

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private firestoreService: FirestoreService,
    private tasksService: TasksService
  ) { }

  ngOnInit() {

    // Obtener los datos de la tarea pasada como parámetro
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.taskID = navigation.extras.state['taskID'];
      this.associatedDescriptionId = navigation.extras.state['associatedDescriptionId'];
      this.estadoTarea = navigation.extras.state['completed'];

      console.log('Tarea seleccionada:', this.taskID);
      console.log('ID de la descripción asociada:', this.associatedDescriptionId);
      console.log('Estado de la tarea (array de completados):', this.estadoTarea);

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
  }

  async loadTarea(taskID: string) {
    try {
      // Cargar la tarea desde Firestore usando taskID
      const tareaDoc = await this.firestoreService.getDocument<TaskI>(`Tasks/${taskID}`);
      this.tarea = tareaDoc.data();  // Ahora tenemos la tarea completa
      console.log('Tarea cargada:', this.tarea);
  
      // No marcar la tarea como completada aún, esto se hace solo cuando el usuario la marca como completada
      // Obtener el nombre del estudiante logueado
      const userName = this.userActual.name;  // Nombre del estudiante logueado
  
      // Buscar el índice del alumno en el array 'assigned' usando el nombre del estudiante
      const studentIndex = this.tarea.assigned.findIndex(name => name === userName);  // Compara por nombre
    
      if (studentIndex !== -1) {
        // Aquí no marcamos la tarea como completada aún
        console.log(`El estudiante ${userName} está asignado a esta tarea.`);
      } else {
        console.log(`El estudiante ${userName} no está asignado a esta tarea.`);
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
    const userName = this.userActual.name;  // Nombre del estudiante logueado
    const studentIndex = this.tarea.assigned.findIndex(name => name === userName);  // Compara con el nombre logueado
  
    if (studentIndex !== -1) {
      // Marcamos la tarea como completada para este alumno
      this.tarea.completed[studentIndex] = true;
      this.tarea.doneTime[studentIndex] = Timestamp.now();
      this.tareaCompletada = true;
    
      // Mostrar confeti 1.7s después de que empiece la animación del texto
      setTimeout(() => {
        this.mostrarConfeti = true;
      }, 1600);  // 1700 ms = 1.7 segundos
  
      // Actualiza la tarea en el servicio de Firestore
      this.tasksService.actualizarTarea(this.tarea, studentIndex).then(() => {
        console.log('Tarea actualizada a completada:', this.tarea);
      }).catch(error => {
        console.error('Error actualizando tarea:', error);
      });
  
      // Después de la animación, redirige al listado
      setTimeout(() => {
        this.volverListado(); // Redirige al listado de tareas
      }, 6000); // Espera para volver al listado de tareas
    } else {
      console.error('El estudiante no está asignado a esta tarea.');
    }
  }
  
  marcarEnlaceVisitado(){
    this.enlaceVisitado = true;
  }

}