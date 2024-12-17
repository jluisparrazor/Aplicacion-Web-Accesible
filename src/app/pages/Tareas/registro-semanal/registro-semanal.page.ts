import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI } from 'src/app/common/models/task.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DocumentReference } from '@angular/fire/firestore';
import { getDoc } from 'firebase/firestore';
import { Timestamp } from '@angular/fire/firestore';
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
  IonItemDivider, IonIcon, IonButtons, IonAvatar, IonImg, IonSpinner } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro-semanal',
  templateUrl: './registro-semanal.page.html',
  styleUrls: ['./registro-semanal.page.scss'],
  standalone: true,
  imports: [IonSpinner, IonImg, IonAvatar, IonButtons, IonIcon, 
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
  todasTareas: { [key: string]: TaskI[] } = {};
  seleccionado: string = ''; // Id del alumno seleccionado
  descripcionesMap: { [key: string]: DescriptionI | undefined } = {}; // Mapa para almacenar descripciones completas
  cargando: boolean = true; // Estado para controlar la carga de datos

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    try {
      this.cargando = true; // Iniciar el estado de carga

      // Obtener todos los alumnos
      this.alumnos = await this.firestoreService.getCollection('Students');

      // Cargar todas las tareas y descripciones asociadas
      await this.cargarTodasLasTareas();

      this.cargando = false; // Finalizar el estado de carga
    } catch (error) {
      console.error('Error al inicializar la página:', error);
      this.cargando = false; // Asegurarse de que el spinner desaparezca incluso si hay errores
    }
  }

  private async cargarTodasLasTareas() {
    try {
      // Crear un mapa para almacenar todas las tareas por alumno
      const tareasMap: { [key: string]: TaskI[] } = {};

      for (const alumno of this.alumnos) {
        const tareas = await this.firestoreService.getTareasPorUsuario(alumno.id);
        tareasMap[alumno.id] = tareas;
      }

      // Obtener los IDs únicos de las descripciones asociadas a todas las tareas
      const tareasArray = Object.values(tareasMap).reduce((acc, curr) => acc.concat(curr), []); // Alternativa a flat
      const descripcionIds = [...new Set(tareasArray.map((t: TaskI) => t.associatedDescriptionId))];

      // Cargar todas las descripciones asociadas
      const descripciones = await Promise.all(
        descripcionIds.map(id => this.firestoreService.getDocument<DescriptionI>(`Description/${id}`))
      );

      // Crear un mapa de descripciones para un acceso rápido
      this.descripcionesMap = descripciones.reduce((map, descSnap, index) => {
        if (descSnap.exists()) { // Asegúrate de que el documento exista
          map[descripcionIds[index]] = descSnap.data() as DescriptionI;
        }
        return map;
      }, {} as { [key: string]: DescriptionI });

      // Guardar todas las tareas organizadas por alumno
      this.todasTareas = tareasMap;
    } catch (error) {
      console.error('Error al cargar todas las tareas:', error);
    }
  }
  
  cargarTareas(alumnoId: string, alumnoNombre: string) {
    this.seleccionado = alumnoNombre;

    // Limpiar listas
    this.tareasPendientes = [];
    this.tareasCompletadas = [];

    // Obtener las tareas del alumno seleccionado
    const tareas = this.todasTareas[alumnoId] || [];

    // Clasificar las tareas como pendientes o completadas
    for (const tarea of tareas) {
      const assignedStrings = tarea.assigned.map((assignee: any) =>
        typeof assignee === 'string' ? assignee : assignee?.id
      );

      const index = assignedStrings.indexOf(alumnoNombre);

      if (index !== -1) {
        const isCompleted = tarea.completed?.[index] ?? false;

        if (isCompleted) {
          this.tareasCompletadas.push(tarea);
        } else {
          this.tareasPendientes.push(tarea);
        }
      }
    }
  }

  getDoneTime(tarea: TaskI, alumnoId: string): Timestamp[] {
    const alumnoIndex = tarea.assigned.findIndex(name => name === alumnoId);
  
    // Si el índice es válido y existe un doneTime correspondiente, devuélvelo como un array
    if (alumnoIndex !== -1 && tarea.doneTime && tarea.doneTime[alumnoIndex]) {
      return [tarea.doneTime[alumnoIndex]];
    }
  
    // Si no hay fecha de finalización, devuelve un array vacío
    return [];
  }
}  
