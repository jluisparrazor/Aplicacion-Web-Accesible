import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TareaI } from 'src/app/common/models/tarea.models';
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
  tareasPendientes: TareaI[] = []; // Tareas pendientes del alumno seleccionado
  tareasCompletadas: TareaI[] = []; // Tareas completadas del alumno seleccionado
  seleccionado: string = ''; // Id del alumno seleccionado

  constructor(private firestoreService: FirestoreService) {}

  async ngOnInit() {
    // Obtener todos los alumnos
    this.alumnos = await this.firestoreService.getCollection('Usuarios');
  }
  

  async cargarTareas(alumnoId: string, alumnoNombre: string) {
    this.seleccionado = alumnoNombre;

    // Recuperar tareas del alumno seleccionado
    const tareas = await this.firestoreService.getTareasPorUsuario(alumnoId);

    // Separar tareas por estado
    this.tareasPendientes = tareas.filter((tarea) => !tarea.Completada);
    this.tareasCompletadas = tareas.filter((tarea) => tarea.Completada);
  }
}