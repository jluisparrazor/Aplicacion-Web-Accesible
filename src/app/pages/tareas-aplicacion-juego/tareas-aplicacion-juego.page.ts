import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { UserI } from 'src/app/common/models/users.models';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';

@Component({
  selector: 'app-tareas-aplicacion-juego',
  templateUrl: './tareas-aplicacion-juego.page.html',
  styleUrls: ['./tareas-aplicacion-juego.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule]
})
export class TareasAplicacionJuegoPage implements OnInit {
  tareaCompletada: boolean = false;
  mostrarConfeti: boolean = false;
  userActual: UserI;
  enlaceVisitado = false;

  tarea: TaskI;
  descripcion: DescriptionI;

  //Cosas pasadas por state
  taskID: string;
  associatedDescriptionId: string;
  estadoTarea: boolean = false;


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
      console.log('Estado de la tarea:', this.estadoTarea);

      // Cargar la descripción asociada desde Firestore
      if (this.associatedDescriptionId) {
        this.loadDescripcion(this.associatedDescriptionId);
      }

      // Cargar la tarea desde Firestore usando taskID
      this.loadTarea(this.taskID);
    }

    const user = this.sessionService.getCurrentUser();
  
    if (user && 'password' in user) {
      this.userActual = user as UserI;
      console.log('Usuario loggeado:', this.userActual.nombre);
    } else {
      console.error('El usuario actual no es válido o no es un UserI.');
      this.router.navigate(['/loginalumno']);
    }
  }

  // Método para cargar la tarea usando taskID
  async loadTarea(taskID: string) {
    try {
      const tareaDoc = await this.firestoreService.getDocument<TaskI>(`Tasks/${taskID}`);
      this.tarea = tareaDoc.data();  // Ahora tenemos la tarea completa
      console.log('Tarea cargada:', this.tarea);
      this.tareaCompletada = this.tarea.completed;  // Actualizamos el estado de la tarea
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

  // Función para marcar la tarea como completada
  completarTarea() {
    this.tareaCompletada = true;
    this.tarea.completed = true;

    // Mostrar confeti 1.7s después de que empiece la animación del texto
    setTimeout(() => {
      this.mostrarConfeti = true;
    }, 1600);  // 1700 ms = 1.7 segundos

    // Actualiza la tarea en el servicio de Firestore
    this.tasksService.actualizarTarea(this.tarea).then(() => {
      console.log('Tarea actualizada a completada:', this.tarea);
      // Emitimos la tarea actualizada para que otros componentes la reciban
    }).catch(error => {
      console.error('Error actualizando tarea:', error);
    });

    // Después de la animación, redirige al listado
    setTimeout(() => {
      this.volverListado(); // Redirige al listado de tareas
    }, 6000); // Espera para volver al listado de tareas
  }

  marcarEnlaceVisitado(){
    this.enlaceVisitado = true;
  }
}