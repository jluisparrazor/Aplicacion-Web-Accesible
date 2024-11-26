import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';
import { UserI } from 'src/app/common/models/users.models';
import { TareaI } from 'src/app/common/models/tarea.models';

@Component({
  selector: 'app-tareas-aplicacion-juego',
  templateUrl: './tareas-aplicacion-juego.page.html',
  styleUrls: ['./tareas-aplicacion-juego.page.scss'],
  standalone: true,
  imports: [IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule]
})
export class TareasAplicacionJuegoPage implements OnInit {
  tareaCompletada: boolean = false;
  mostrarConfeti = false;
  userActual: UserI;
  tarea: TareaI;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private firestoreService: FirestoreService
  ) { }

  ngOnInit() {

    // Obtener los datos de la tarea pasada como parámetro
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['tarea']) {
      this.tarea = navigation.extras.state['tarea'];
      console.log('Tarea seleccionada:', this.tarea);
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
  
  // Función para volver al listado de tareas
  volverListado() {
    this.router.navigate(['/tareasdiarioalumno']); // Aquí va la ruta a la página del listado
  }

  // Función para marcar la tarea como completada
  completarTarea() {
    this.tareaCompletada =
    this.tarea.Completada = true;

    // Actualiza la tarea en el servicio de Firestore
    this.firestoreService.actualizarTarea(this.tarea).then(() => {
      console.log('Tarea actualizada a completada:', this.tarea);
    }).catch(error => {
      console.error('Error actualizando tarea:', error);
    });
        
    // Mostrar el GIF de confeti 1 segundo después de que comience la animación del texto
    setTimeout(() => {
      this.mostrarConfeti = true;
    }, 1000); // 1000 ms = 1 segundo

    // Después de la animación, redirige al listado
    setTimeout(() => {
      this.volverListado(); // Redirige al listado de tareas
    }, 5850); // Espera para volver al listado de tareas
  }
}