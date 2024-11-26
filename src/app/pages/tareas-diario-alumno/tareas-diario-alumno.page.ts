import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon } from '@ionic/angular/standalone';
import { UserI } from 'src/app/common/models/users.models';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TareaI } from 'src/app/common/models/tarea.models';

@Component({
  selector: 'app-tareas-diario-alumno',
  templateUrl: './tareas-diario-alumno.page.html',
  styleUrls: ['./tareas-diario-alumno.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardTitle, IonCardHeader, IonCardSubtitle, IonCardContent, IonButton, IonIcon]
})
export class TareasDiarioAlumnoPage implements OnInit {

  userActual: UserI;
  tareasIncompletas: any[] = []; 
  tareasCompletadas: any[] = [];

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {
    console.log('Comprobando sesión...');
    const user = this.sessionService.getCurrentUser();
  
    if (user && 'password' in user) {
      this.userActual = user as UserI;
      console.log('Usuario loggeado:', this.userActual.nombre);
      this.loadTareas(); // Cargar las tareas después de validar al usuario
      // Nos suscribimos a los cambios de tareas actualizadas
      this.firestoreService.tareaActualizada$.subscribe((tarea: TareaI | null) => {
        if (tarea) {
          // Actualizamos las listas de tareas cuando la tarea es actualizada
          this.actualizarListaTareas(tarea);
        }
      });
    } else {
      console.error('El usuario actual no es válido o no es un UserI.');
      this.router.navigate(['/loginalumno']);
    }
  }

  // Método para cargar las tareas desde Firestore
  async loadTareas() {
    const nombreUsuario = this.userActual.nombre; // Nombre del usuario actual
    try {
      // Cargar todas las tareas asignadas al usuario
      const todasLasTareas = await this.firestoreService.getCollection('Tareas', [
        { field: 'Asignado', operator: '==', value: nombreUsuario },
      ]);
  
      // Filtrar y actualizar las listas de tareas
      this.tareasIncompletas = todasLasTareas.filter(tarea => !tarea.Completada);
      this.tareasCompletadas = todasLasTareas.filter(tarea => tarea.Completada);
  
      console.log('Tareas incompletas:', this.tareasIncompletas);
      console.log('Tareas completadas:', this.tareasCompletadas);
    } catch (error) {
      console.error('Error al cargar las tareas:', error);
    }
  }
  
  // Método para actualizar las listas de tareas cuando se recibe una tarea actualizada
  actualizarListaTareas(tarea: any) {
    // Eliminar la tarea de las incompletas y agregarla a las completadas
    this.tareasIncompletas = this.tareasIncompletas.filter(t => t.id !== tarea.id);
    this.tareasCompletadas.push(tarea);
    console.log('Tareas incompletas actualizadas:', this.tareasIncompletas);
    console.log('Tareas completadas actualizadas:', this.tareasCompletadas);
  }

  // Navegar dependiendo del tipo de tarea
  navegarTarea(tarea: TareaI) {
    switch (tarea.Tipo) {
      case 'aplicacionJuego':
      console.log('Tarea: ', tarea.Nombre, 'Tipo: ', tarea.Tipo, 'Id: ', tarea.id);
      this.router.navigate(['/tareasaplicacionjuego'], {
        state: { tarea: tarea } // Pasamos la tarea seleccionada
      });
      break;

      case 'porPasos':
        this.router.navigate(['/tareasporpasos']);
        break;

      case 'normal':
        // Navegación pendiente de implementar
        console.warn('La redirección para "normal" no está implementada.');
        break;

      case 'menu':
        // Navegación pendiente de implementar
        console.warn('La redirección para "menu" no está implementada.');
        break;

      case 'material':
        // Navegación pendiente de implementar
        console.warn('La redirección para "material" no está implementada.');
        break;

      default:
        console.error(`Tipo de tarea desconocido: ${tarea.Tipo}`);
    }
  }
}
