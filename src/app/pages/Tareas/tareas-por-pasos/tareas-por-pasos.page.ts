import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonImg, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonLabel, IonItem } from '@ionic/angular/standalone';
import { StudentI } from 'src/app/common/models/student.models';
import { TaskI } from 'src/app/common/models/task.models';
import { DescriptionI, StepI } from 'src/app/common/models/task.models';
import { Timestamp } from '@angular/fire/firestore';
import { CelebracionComponent } from "../../../shared/celebracion/celebracion.component";
import { doc, setDoc } from 'firebase/firestore';
import { max } from 'rxjs';

@Component({
  selector: 'app-tareas-por-pasos',
  templateUrl: './tareas-por-pasos.page.html',
  styleUrls: ['./tareas-por-pasos.page.scss'],
  standalone: true,
  imports: [IonLabel, IonItem, IonCard, IonCardContent, IonCol, IonRow, IonGrid, IonImg, IonAvatar, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonButton, CommonModule, FormsModule, CelebracionComponent]
})
export class TareasPorPasosPage implements OnInit {

  tareaCompletada: boolean = false;
  mostrarConfeti: boolean = false;
  userActual: StudentI;
  studentIndex: number;

  tarea: TaskI;
  descripcion: DescriptionI;

  enlaceVisitado = false;

  //Cosas pasadas por state
  taskID: string;
  associatedDescriptionId: string;
  estadoTarea: boolean[] = []; // Ahora es un array de booleanos

  // Paso actual a mostrar
  currentStep: StepI
  currentStepi: number

  //Visualización
  visualization: string;

  constructor(
    private router: Router,
    private sessionService: SessionService,
    private firestoreService: FirestoreService,
    private tasksService: TasksService
  ) { }

  ngOnInit() {
    // Obtener los datos de la tarea pasada como parámetro
    const navigation = this.router.getCurrentNavigation();
  
    const user = this.sessionService.getCurrentUser();
  
    if (user && 'correctPassword' in user) {
      this.userActual = user as unknown as StudentI;
      console.log('Usuario loggeado:', this.userActual.name);
      
      if (this.userActual.stepVisualization !== undefined && this.userActual.stepVisualization !== null)
        this.visualization = this.userActual.stepVisualization

      if (navigation?.extras?.state) {
        this.taskID = navigation.extras.state['taskID'];
        this.associatedDescriptionId = navigation.extras.state['associatedDescriptionId'];
        this.estadoTarea = navigation.extras.state['completed'];

        console.log('Tarea seleccionada:', this.taskID);
        console.log('ID de la descripción asociada:', this.associatedDescriptionId);
        console.log('Estado de la tarea para ', user.name, ': ', this.estadoTarea);
    
        // Cargar la descripción asociada desde Firestore
        if (this.associatedDescriptionId)
          this.loadDescripcion(this.associatedDescriptionId);
    
        // Cargar la tarea desde Firestore usando taskID
        this.loadTarea(this.taskID);
  
      }

    } else {
      console.error('El usuario actual no es válido o no es un StudentI.');
      this.router.navigate(['/loginalumno']);
    }

  } 

  async loadTarea(taskID: string) {
    try {
      // Cargar la tarea desde Firestore usando taskID
      const tareaDoc = await this.firestoreService.getDocument<TaskI>(`Tasks/${taskID}`);
      this.tarea = tareaDoc.data();  // Ahora tenemos la tarea completa
      console.log('Tarea cargada:', this.tarea);
  
      // Obtener el ID del estudiante logueado
      const userId = this.userActual.id;  // ID del estudiante logueado

      // Buscar el alumno en el array 'assigned' usando el ID del estudiante
      const assignedStudent = this.tarea.assigned.find(assignment => assignment.assignedId === userId);  // Compara por ID del alumno

      // Buscar el índice del alumno en el array 'assigned' usando el ID del estudiante
      this.studentIndex = this.tarea.assigned.findIndex(assignment => assignment.assignedId === userId);  // Compara por ID del alumno
  
      if (this.studentIndex !== -1) {
        // El alumno está asignado a la tarea
        console.log(`El estudiante ${assignedStudent.assignedName} sí está asignado a esta tarea.`);

        // Guardar el paso en una variable local

        this.currentStepi = this.tarea.assigned[this.studentIndex].nStepsCompleted
        console.log("Paso actual: ", this.currentStepi)
        this.initStep()

      } else {
        console.log(`El estudiante ${assignedStudent.assignedName} no está asignado a esta tarea.`);
      }

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

  initStep() {
    // Paso actual a mostrar
    this.currentStep = null
    if (this.descripcion.steps !== undefined && this.descripcion.steps !== null && this.descripcion.steps && this.descripcion.steps.length > 0) 
      this.currentStep = this.descripcion.steps[ this.currentStepi < this.descripcion.steps.length? this.currentStepi : this.descripcion.steps.length-1 ]
  }
  
  // Función para volver al listado de tareas
  volverListado() {
    this.router.navigate(['/tareasdiarioalumno']); // Aquí va la ruta a la página del listado
  }

  completarTarea() {
    const assignedId = this.userActual.id;  // ID del alumno logueado
    const studentIndex = this.tarea.assigned.findIndex(assignment => assignment.assignedId === assignedId);
  
    if (studentIndex !== -1) {
      // Marcamos la tarea como completada para este alumno
      this.tarea.assigned[studentIndex].completed = true;  // Marca como completada
      this.tarea.assigned[studentIndex].doneTime = Timestamp.now();  // Marca la fecha de finalización
      this.tareaCompletada = true;
  
      // Mostrar confeti 1.7s después de que empiece la animación del texto
      setTimeout(() => {
        this.mostrarConfeti = true;
      }, 1600);  // 1700 ms = 1.7 segundos
  
      // Actualiza la tarea en el servicio de Firestore pasando el ID del alumno
      this.tasksService.actualizarTarea(this.tarea, assignedId).then(() => {
        console.log('Tarea actualizada a completada:', this.tarea);
      }).catch(error => {
        console.error('Error actualizando tarea:', error);
      });
  
      // Después de la animación, redirige al listado
      setTimeout(() => {
        this.volverListado(); // Redirige al listado de tareas
      }, 6000); // Espera para volver al listado de tareas
    } else {
      console.error('El estudiante no está asignado a esta tarea.');
    }
  }

  completeStep() {
    console.log("Avanzando del paso ", this.currentStepi, " al siguiente")

    if (this.studentIndex !== -1) {
     
      // Marcar paso como completado
      this.currentStepi++

      // Escribir en la base de datos
      this.tarea.assigned[this.studentIndex].nStepsCompleted = this.currentStepi
      
      this.tasksService.updateTask(this.tarea).then(() => {
        console.log('Paso actualizado a completado:', this.tarea);
      
      }).catch(error => {
        console.error('Error actualizando tarea:', error);
      });

      if (this.currentStepi < this.descripcion.steps.length) {
        setTimeout(() => {
          this.currentStep = this.descripcion.steps[this.currentStepi]
        }, 500)
      }

    }

    console.log("Ahora estamos en el paso: ", this.currentStepi)
  }

  backStep() {
    console.log("Retrocediendo de paso ", this.currentStepi, " al anterior")

    if (this.studentIndex !== -1) {
     
      // Marcar paso como no completado
      this.currentStepi--

      // Escribir en la base de datos
      this.tarea.assigned[this.studentIndex].nStepsCompleted = this.currentStepi

      // Actualiza la tarea en el servicio de Firestore pasando el ID del alumno
      this.tasksService.updateTask(this.tarea).then(() => {
        console.log('Paso actualizado a no completado:', this.tarea);
      }).catch(error => {
        console.error('Error actualizando tarea:', error);
      });

      if (this.currentStepi > -1) {
        setTimeout(() => {
          this.currentStep = this.descripcion.steps[this.currentStepi]
        }, 500)
      }

    }

    console.log("Ahora estamos en el paso: ", this.currentStepi)
    
  } 
  
  marcarEnlaceVisitado(){
    this.enlaceVisitado = true;
  }

}