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
  // Flags para mostrar las tareas
  mostrarPendientesFlag = true;
  mostrarCompletadasFlag = false;

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
      this.router.navigate(['/paginainicial']);
    }
  }

  // Método para cargar las tareas desde Firestore
  async loadTareas() {
    const nombreUsuario = this.userActual.name; // Nombre del usuario actual
    try {
      // Cargar todas las tareas que contienen al usuario en el array 'assigned'
      const todasLasTareas = await this.firestoreService.getCollection('Tasks', [
        { field: 'assigned', operator: 'array-contains', value: nombreUsuario },
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
    
      // Filtrar las tareas incompletas y completadas basándonos en el array 'assigned' y 'completed'
      this.tareasIncompletas = [];
      this.tareasCompletadas = [];

      todasLasTareas.forEach(tarea => {
        const usuarioIndex = tarea.assigned.indexOf(nombreUsuario); // Obtener el índice del usuario en el array 'assigned'
        
        if (usuarioIndex !== -1) {
          // Verificar si la tarea está completada para el usuario actual
          if (tarea.completed[usuarioIndex]) {
            this.tareasCompletadas.push(tarea);
          } else {
            this.tareasIncompletas.push(tarea);
          }
        }
      });

      console.log('Tareas incompletas:', this.tareasIncompletas);
      console.log('Tareas completadas:', this.tareasCompletadas);
      console.log('Descripciones:', this.descripcionesMap);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }

  
  // Método para actualizar las listas de tareas cuando se recibe una tarea actualizada
  actualizarListaTareas(tarea: any) {
    const nombreUsuario = this.userActual.name; // Nombre del usuario actual

    // Obtener el índice del usuario en el array 'assigned'
    const usuarioIndex = tarea.assigned.indexOf(nombreUsuario);

    if (usuarioIndex !== -1) {
      // Si la tarea ha sido completada para el usuario actual
      if (tarea.completed[usuarioIndex]) {
        // Eliminar la tarea de las incompletas y agregarla a las completadas
        this.tareasIncompletas = this.tareasIncompletas.filter(t => t.taskID !== tarea.taskID);
        this.tareasCompletadas.push(tarea);
      } else {
        // Si la tarea no está completada para el usuario actual
        this.tareasCompletadas = this.tareasCompletadas.filter(t => t.taskID !== tarea.taskID);
        this.tareasIncompletas.push(tarea);
      }

      console.log('Tareas incompletas actualizadas:', this.tareasIncompletas);
      console.log('Tareas completadas actualizadas:', this.tareasCompletadas);
    } else {
      console.log('El usuario no tiene asignada esta tarea');
    }
  }


  mostrarPendientes() {
    this.mostrarCompletadasFlag = false; // Oculta completadas
    this.mostrarPendientesFlag = true; // Muestra pendientes después de la animación
  }
  
  mostrarCompletadas() {
    this.mostrarPendientesFlag = false; // Oculta pendientes
    this.mostrarCompletadasFlag = true; // Muestra completadas después de la animación
  }

  getDoneTime(tarea: TaskI, alumnoId: string): string[] {  
    if (!tarea?.assigned || !tarea?.doneTime) {
      console.log('No hay datos suficientes en tarea.');
      return [];
    }
  
    const alumnoIndex = tarea.assigned.findIndex(name => name === this.userActual.name);
    
    if (alumnoIndex !== -1 && tarea.doneTime[alumnoIndex]) {
      const timestamp = tarea.doneTime[alumnoIndex];
      return [
        timestamp.toDate().toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      ]; // Cambia el formato según tus necesidades
    }
  
    console.log(`No se encontró fecha de finalización para ${alumnoId}.`);
    return [];
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
        // Navegación pendiente de implementar
        const stepTaskDescripcion = this.descripcionesMap[tarea.associatedDescriptionId];
        this.router.navigate(['/tareasporpasos'], {
          state: { 
            taskID: tarea.taskID,  // Solo pasamos el ID de la tarea
            associatedDescriptionId: tarea.associatedDescriptionId,
            completed: tarea.completed
          } 
        });
        break;

      case 'NormalTask':
        // Navegación pendiente de implementar
        console.warn('La redirección para "normal" no está implementada.');
        break;

      case 'MenuTask':
        this.router.navigate(['/task-menus']);
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
