import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonLabel,
  IonItem,
  IonText,
  IonList,
  IonItemDivider, IonIcon, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro-semanal',
  templateUrl: './registro-semanal.page.html',
  styleUrls: ['./registro-semanal.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, 
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonLabel,
    IonItem,
    IonText,
    IonList,
    IonItemDivider,
    RouterLink,
  ],
})
export class RegistroSemanalPage implements OnInit {
  alumnos: any[] = []; // Lista de alumnos
  tareasPendientes: TaskI[] = []; // Tareas pendientes del alumno seleccionado
  tareasCompletadas: TaskI[] = []; // Tareas completadas del alumno seleccionado
  seleccionado: string = ''; // Id del alumno seleccionado
  descripcionesMap: { [key: string]: DescriptionI | undefined } = {}; // Mapa para almacenar descripciones completas

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    // Obtener todos los alumnos
    this.alumnos = await this.firestoreService.getCollection('Students');
  }
  
  async cargarTareas(alumnoId: string, alumnoNombre: string) {
    this.seleccionado = alumnoNombre;

    // Recuperar tareas del alumno seleccionado
    const tareas = await this.firestoreService.getTareasPorUsuario(alumnoId);

    // Recuperar descripciones de las tareas
    const descripcionIds = [...new Set(tareas.map((tarea) => tarea.associatedDescriptionId))];
    const descripciones = await Promise.all(
      descripcionIds.map((id) => this.firestoreService.getDocument<DescriptionI>(`Description/${id}`))
    );

    // Crear un mapa para las descripciones
    this.descripcionesMap = descripciones.reduce((map, descSnap, index) => {
      map[descripcionIds[index]] = descSnap.data() as DescriptionI;
      return map;
    }, {} as { [key: string]: DescriptionI });

    // Separar tareas por estado
    this.tareasPendientes = tareas.filter((tarea) => !tarea.completed);
    this.tareasCompletadas = tareas.filter((tarea) => tarea.completed);
  }
}
