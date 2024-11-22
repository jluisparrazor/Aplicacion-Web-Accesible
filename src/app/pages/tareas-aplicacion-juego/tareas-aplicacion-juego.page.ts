import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon } from '@ionic/angular/standalone';

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

  constructor(private router: Router) { }

  ngOnInit() {
  }

  // Función para volver al listado de tareas
  volverListado() {
    this.router.navigate(['/tareasdiarioalumno']); // Aquí va la ruta a la página del listado
  }

  // Función para marcar la tarea como completada
  completarTarea() {
    this.tareaCompletada = true;
    
    // Aquí podrías añadir la lógica para cambiar el estado de la tarea en tu base de datos o servicio
    
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