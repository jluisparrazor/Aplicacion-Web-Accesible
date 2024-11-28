import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonImg, IonAvatar } from '@ionic/angular/standalone';
// import { UserI } from 'src/app/common/models/users.models';
import { StudentI } from 'src/app/common/models/student.models';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';

@Component({
  selector: 'app-tareas-diario-alumno',
  templateUrl: './tareas-diario-alumno.page.html',
  styleUrls: ['./tareas-diario-alumno.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon]
})
export class TareasDiarioAlumnoPage implements OnInit {

  userActual: StudentI;
  tareasIncompletas: any[] = []; 
  tareasCompletadas: any[] = [];
  descripcionesMap: { [key: string]: DescriptionI } = {};

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private firestoreService: FirestoreService,
    private tasksService: TasksService
  ) { }

  ngOnInit() {
    console.log('Comprobando sesión...');
    const user = this.sessionService.getCurrentUser();
  
    if (user && 'correctPassword' in user) {
      this.userActual = user as unknown as StudentI;
      console.log('Usuario loggeado:', this.userActual.name);
      this.loadTareas(); // Cargar las tareas después de validar al usuario
      // Nos suscribimos a los cambios de tareas actualizadas
      this.tasksService.updatedTask$.subscribe((tarea: TaskI | null) => {
        if (tarea) {
          // Actualizamos las listas de tareas cuando la tarea es actualizada
          this.actualizarListaTareas(tarea);
        }
      });
    } else {
      console.error('El usuario actual no es válido o no es un StudentI.');
      this.router.navigate(['/loginalumno']);
    }
  }

  // Método para cargar las tareas desde Firestore
  async loadTareas() {
    const nombreUsuario = this.userActual.name; // Nombre del usuario actual
    try {
      // Cargar todas las tareas asignadas al usuario
      const todasLasTareas = await this.firestoreService.getCollection('Tasks', [
        { field: 'assigned', operator: '==', value: nombreUsuario },
      ]);
  
      console.log('Tareas encontradas:', todasLasTareas); // Depuración
      
      // Obtener los IDs únicos de las descripciones asociadas
      const descripcionIds = [...new Set(todasLasTareas.map(tarea => tarea.associatedDescriptionId))];
    
      // Cargar todas las descripciones asociadas
      const descripciones = await Promise.all(
        descripcionIds.map(id => this.firestoreService.getDocument<DescriptionI>(`Description/${id}`))
      );
    
      // Crear un mapa de descripciones para un acceso rápido
      this.descripcionesMap = descripciones.reduce((map, descSnap, index) => {
        map[descripcionIds[index]] = descSnap.data() as DescriptionI;
        return map;
      }, {} as { [key: string]: DescriptionI });
    
      // Filtrar y actualizar las listas de tareas
      this.tareasIncompletas = todasLasTareas.filter(tarea => !tarea.completed);
      this.tareasCompletadas = todasLasTareas.filter(tarea => tarea.completed);
    
      console.log('Tareas incompletas:', this.tareasIncompletas);
      console.log('Tareas completadas:', this.tareasCompletadas);
      console.log('Descripciones:', this.descripcionesMap);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }
  
  // Método para actualizar las listas de tareas cuando se recibe una tarea actualizada
  actualizarListaTareas(tarea: any) {
    // Eliminar la tarea de las incompletas y agregarla a las completadas
    this.tareasIncompletas = this.tareasIncompletas.filter(t => t.taskID !== tarea.taskID);
    this.tareasCompletadas.push(tarea);
    console.log('Tareas incompletas actualizadas:', this.tareasIncompletas);
    console.log('Tareas completadas actualizadas:', this.tareasCompletadas);
  }

  // Navegar dependiendo del tipo de tarea
  navegarTarea(tarea: TaskI) {
    switch (tarea.type) {
      case 'AppTask':
        const descripcion = this.descripcionesMap[tarea.associatedDescriptionId];
        this.router.navigate(['/tareasaplicacionjuego'], {
          state: { 
            taskID: tarea.taskID,  // Solo pasamos el ID de la tarea
            associatedDescriptionId: tarea.associatedDescriptionId,
            completed: tarea.completed
          } 
        });
        break;

      case 'StepTask':
        this.router.navigate(['/tareasporpasos']);
        break;

      case 'NormalTask':
        // Navegación pendiente de implementar
        console.warn('La redirección para "normal" no está implementada.');
        break;

      case 'MenuTask':
        this.router.navigate(['/choose-menus']);
        break;

      case 'RequestTask':
        // Navegación pendiente de implementar
        console.warn('La redirección para "material" no está implementada.');
        break;

      default:
        console.error(`Tipo de tarea desconocido: ${tarea.type}`);
    }
  }
}
