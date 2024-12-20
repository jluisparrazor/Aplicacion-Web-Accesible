import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon, IonImg, IonAvatar, IonButtons } from '@ionic/angular/standalone';
// import { UserI } from 'src/app/common/models/users.models';
import { StudentI } from 'src/app/common/models/student.models';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';
import { Timestamp } from '@angular/fire/firestore';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tareas-diario-alumno',
  templateUrl: './tareas-diario-alumno.page.html',
  styleUrls: ['./tareas-diario-alumno.page.scss'],
  standalone: true,
  imports: [IonButtons, IonAvatar, IonImg, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon]
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
    private tasksService: TasksService,
    private cdRef: ChangeDetectorRef
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
          console.log('Tarea actualizada:', tarea);  // Verifica que se está emitiendo la tarea actualizada
          this.actualizarListaTareas(tarea);  // Actualiza la lista de tareas
        }
      });
    } else {
      console.error('El usuario actual no es válido o no es un StudentI.');
      this.router.navigate(['/paginainicial']);
    }
  }
  
  // Método para cargar las tareas desde Firestore
  async loadTareas() {
    const userId = this.userActual.id; // ID del usuario actual
    try {
      // Cargar todas las tareas (sin el filtro array-contains)
      const todasLasTareas = await this.firestoreService.getCollection('Tasks');
  
      if (!todasLasTareas || todasLasTareas.length === 0) {
        console.log('No se encontraron tareas en Firestore.');
        return;
      }
  
      // Obtener los IDs únicos de las descripciones asociadas a estas tareas
      const descripcionIds = [...new Set(todasLasTareas.map(tarea => tarea.associatedDescriptionId))];
  
      // Cargar las descripciones asociadas
      const descripciones = await Promise.all(
        descripcionIds.map(id => this.firestoreService.getDocument<DescriptionI>(`Description/${id}`))
      );
  
      // Crear un mapa de descripciones para un acceso rápido
      this.descripcionesMap = descripciones.reduce((map, descSnap, index) => {
        if (descSnap) {
          map[descripcionIds[index]] = descSnap.data() as DescriptionI;
        }
        return map;
      }, {} as { [key: string]: DescriptionI });
  
      // Inicializar listas de tareas
      this.tareasIncompletas = [];
      this.tareasCompletadas = [];
  
      // Filtrar las tareas según su estado para el usuario actual
      todasLasTareas.forEach(tarea => {
        // Verificar si el usuario está asignado a la tarea
        const usuarioAsignado = tarea.assigned.find((assigned: { 
          assignedId: string; 
          completed: boolean; 
          startTime?: Timestamp | null; 
          endTime?: string | null; 
          doneTime?: Timestamp | null; 
        }) => assigned.assignedId === userId);
  
        if (usuarioAsignado) {
          // Verificar y convertir las fechas si son tipo Timestamp
          if (usuarioAsignado.endTime && typeof usuarioAsignado.endTime === 'string') {
            tarea.endTime = new Date(usuarioAsignado.endTime); // Convertir el string en Date
          } else {
            tarea.endTime = null;
          }
  
          if (usuarioAsignado.doneTime && usuarioAsignado.doneTime instanceof Timestamp) {
            tarea.doneTime = usuarioAsignado.doneTime.toDate(); // Convertir a Date si es un Timestamp
          } else {
            tarea.doneTime = null; // Si no es un Timestamp, asignar null
          }
  
          // Clasificar la tarea según si está completada o no
          if (usuarioAsignado.completed) {
            this.tareasCompletadas.push({ ...tarea, assignedUser: usuarioAsignado });
          } else {
            this.tareasIncompletas.push({ ...tarea, assignedUser: usuarioAsignado });
          }
        }
      });
  
      // Depuración
      console.log('Tareas incompletas:', this.tareasIncompletas);
      console.log('Tareas completadas:', this.tareasCompletadas);
      console.log('Descripciones:', this.descripcionesMap);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }  
  
  // Método para actualizar las listas de tareas cuando se recibe una tarea actualizada
  actualizarListaTareas(tarea: TaskI) {
    const userId = this.userActual.id;  // ID del usuario actual
  
    // Buscar al usuario asignado dentro del array `assigned`
    const usuarioAsignado = tarea.assigned.find(assigned => assigned.assignedId === userId);
  
    if (usuarioAsignado) {
      // Verificar si la tarea está completada para el usuario actual
      if (usuarioAsignado.completed) {
        // Mover la tarea de incompletas a completadas
        this.tareasIncompletas = this.tareasIncompletas.filter(t => t.taskID !== tarea.taskID);
        this.tareasCompletadas.push({ ...tarea, assignedUser: usuarioAsignado });
      } else {
        // Mover la tarea de completadas a incompletas
        this.tareasCompletadas = this.tareasCompletadas.filter(t => t.taskID !== tarea.taskID);
        this.tareasIncompletas.push({ ...tarea, assignedUser: usuarioAsignado });
      }
      this.cdRef.detectChanges();  // Forzar detección de cambios
      console.log('Tareas incompletas actualizadas:', this.tareasIncompletas);
      console.log('Tareas completadas actualizadas:', this.tareasCompletadas);

      
    } else {
      console.log('El usuario no tiene asignada esta tarea');
    }
  }
  
  volverListado() {
    this.router.navigate(['/paginainicial']); // Aquí va la ruta a la página del listado
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
    if (!tarea?.assigned || !Array.isArray(tarea.assigned)) {
      console.log('No hay datos válidos en tarea.assigned.');
      return [];
    }

    // Buscar al alumno asignado por su ID
    const alumnoAsignado = tarea.assigned.find((assigned: { 
      assignedId: string; 
      doneTime?: Timestamp | null; 
    }) => assigned.assignedId === alumnoId);
    
    // Validar si se encontró al alumno y si tiene `doneTime`
    if (alumnoAsignado?.doneTime && typeof alumnoAsignado.doneTime.toDate === 'function') {
      try {
        const timestamp = alumnoAsignado.doneTime.toDate(); // Convertir a objeto Date
        return [
          timestamp.toLocaleString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
        ];
      } catch (error) {
        console.error('Error al convertir doneTime a fecha:', error);
        return [];
      }
    }
    // Si no se encuentra `doneTime`
  console.log(`No se encontró fecha de finalización para el alumno con ID ${alumnoId}.`);
  return [];
  }
  
  // Navegar dependiendo del tipo de tarea
  navegarTarea(tarea: TaskI) {
    const descripcion = this.descripcionesMap[tarea.associatedDescriptionId];
  
  // Buscar el estado de la tarea solo para el usuario logueado
  const tareaCompletada = tarea.assigned?.some(assigned => assigned.assignedId === this.userActual.id && assigned.completed) || false;
  
    // Verificar el tipo de tarea y navegar a la página correspondiente
    switch (tarea.type) {
      case 'AppTask':
        if (descripcion) {
          // Si la descripción existe, navegar a la página correspondiente con los datos
          this.router.navigate(['/tareasaplicacionjuego'], {
            state: { 
              taskID: tarea.taskID,
              taskTitle: tarea.title,
              associatedDescriptionId: tarea.associatedDescriptionId,
              completed: tareaCompletada
            }
          });
        } else {
          console.warn('Descripción no encontrada para AppTask:', tarea.associatedDescriptionId);
        }
        break;
  
      case 'StepTask':
        if (descripcion) {
          // Si la descripción existe, navegar a la página correspondiente con los datos
          this.router.navigate(['/tareasporpasos'], {
            state: { 
              taskID: tarea.taskID,
              associatedDescriptionId: tarea.associatedDescriptionId,
              completed: tareaCompletada
            }
          });
        } else {
          console.warn('Descripción no encontrada para StepTask:', tarea.associatedDescriptionId);
        }
        break;

      case 'NormalTask':
        if (descripcion) {
          // Si la descripción existe, navegar a la página correspondiente con los datos
          this.router.navigate(['/task-normal'], {
            state: { 
              taskID: tarea.taskID,
              taskTitle: tarea.title,
              associatedDescriptionId: tarea.associatedDescriptionId,
              completed: tareaCompletada
            }
          });
        } else {
          console.warn('Descripción no encontrada para AppTask:', tarea.associatedDescriptionId);
        }
        break;

      case 'MenuTask':
        this.router.navigate(['/task-menus'],  {
          state: { 
            taskID: tarea.taskID,
            taskTitle: tarea.title,
            pictogramId: descripcion?.pictogramId,

          }
      });
        break;

      case 'RequestTask':
        // Navegación pendiente de implementar
        break;

      default:
        console.error(`Tipo de tarea desconocido: ${tarea.type}`);
    }
  }
}
