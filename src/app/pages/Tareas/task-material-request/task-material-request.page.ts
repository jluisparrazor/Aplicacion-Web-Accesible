import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCol, IonGrid, IonRow, IonImg, IonButton, IonIcon, IonCardContent, IonCard, IonCardTitle, IonLabel, IonFooter } from '@ionic/angular/standalone';
import { CelebracionComponent } from 'src/app/shared/celebracion/celebracion.component';
import { RequestI } from 'src/app/common/models/request.models';
import { SessionService } from 'src/app/common/services/session.service';
import { StudentI } from 'src/app/common/models/student.models';
import { Router } from '@angular/router';
import { TasksService } from 'src/app/common/services/tasks.service';
import { AnimationService } from 'src/app/common/services/animation.service';
import { MaterialService } from 'src/app/common/services/material-update.service';

// POR HACER Esto debería ser la interfaz de material
interface MaterialI {
  id: string
  nombre: string;
  cantidad: number;
  color?: string;
  tamano?: string;
}

@Component({
  selector: 'app-task-material-request',
  templateUrl: './task-material-request.page.html',
  styleUrls: ['./task-material-request.page.scss'],
  standalone: true,
  imports: [IonFooter, IonLabel, IonCardTitle, IonCard, IonCardContent, IonIcon, IonButton, IonImg, IonRow, IonGrid, IonCol, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, CelebracionComponent]
})
export class TaskMaterialRequestPage implements OnInit {
  @ViewChild(CelebracionComponent) celebracionComponent!: CelebracionComponent;

  // Información de la tarea y usuario actual
  taskId: string = '';
  taskTitle: string = "Solicitud de material";
  taskPictogramId: string = '';
  userActual: any = null;

  // Solicitud, materiales y estados
  request: RequestI =
    {
      id: '',
      materiales: [],
      profesor: '',
      clase: ''
    };
  materials: Map<string, MaterialI> = null;
  completed: Map<string, boolean> = null;

  // Variables para la paginación
  materialsPerPage: number = 4;
  currentPage: number = 0;

  // Altura de los elementos
  cardsHeight: number = 160; 
  headerHeight: number = 150;
  footerHeight: number = 100;


  constructor(
    private sessionService: SessionService,
    private router: Router,
    private taskService: TasksService,
    private animationService: AnimationService) { }


  ngOnInit() {
    // Comprobar que el usuario actual es un alumno
    const user = this.sessionService.getCurrentUser();
    if (user && 'correctPassword' in user) {
      this.userActual = user as unknown as StudentI;
      console.log('Usuario loggeado:', this.userActual.name);
    } else {
      console.error('El usuario actual no es válido o no es un StudentI.');
      //this.router.navigate(['/paginainicial']);
    }

    // Obtener el ID de la tarea para marcar como completado al final y obtener el nombre de la tarea
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.taskId = navigation.extras.state['taskID'];
      this.taskTitle = navigation.extras.state['taskTitle'];
      this.taskPictogramId = navigation.extras.state['PictogramId'];
      console.log('Task ID:', this.taskId);
      console.log('Task Title:', this.taskTitle);
      console.log('Task Pictogram ID:', this.taskPictogramId);
      // this.calculateNumMenuTypesPerPage();
    } else
      console.error('No se ha pasado el ID de la tarea.');


    this.loadStructure();
    this.calculateNumMaterialsPerPage();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateNumMaterialsPerPage();
  }


  // Obtener la solicitud y materiales de firebase
  loadStructure() {

    // POR HACER: Obtener la solicitud de firebase
    this.request =
    {
      id: '1',
      materiales: [ // Deberían ser ids de materiales y cantidades
        { cantidad: 2, color: 'rojo', nombre: 'papel', tamano: 'A4' },
        { cantidad: 1, color: 'azul', nombre: 'tijeras', tamano: 'mediano' },
        { cantidad: 3, color: 'verde', nombre: 'cartulina', tamano: 'grande' },
        { cantidad: 5, color: 'amarillo', nombre: 'lápiz', tamano: 'pequeño' }
      ],
      profesor: 'profesor1',
      clase: 'clase1'
    };

    // POR HACER: Obtener los materiales de firebase desde las ids de los materiales y crear un mapa
    this.materials = new Map<string, MaterialI>(
      this.request.materiales.map((material, index) => [index.toString(), { id: index.toString(), ...material }])
    );

    this.completed = new Map<string, boolean>(
      Array.from(this.materials.keys()).map(key => [key, false])
    );
  }

  // Calcular el número de materiales por página
  calculateNumMaterialsPerPage() {
    const contentHeight = window.innerHeight - this.headerHeight - this.footerHeight;
    console.log('window.innerHeight', window.innerHeight, ' headerHeight', this.headerHeight, ' footerHeight', this.footerHeight);

    this.materialsPerPage = Math.floor(contentHeight / this.cardsHeight);
  }

  // Obtener los materiales de la página actual
  getMaterialsForcurrentPage(): MaterialI[] {
    const startIndex = this.currentPage * this.materialsPerPage;
    return Array.from(this.materials.values()).slice(startIndex, startIndex + this.materialsPerPage);
  }

  // Pasar a la siguiente página
  nextPage() {
    if ((this.currentPage + 1) * this.materialsPerPage < this.materials.size) {
      this.currentPage++;
    }
  }

  // Volver a la página anterior
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // Completar un material
  completeMaterial(index: string) {
    this.completed.set(index, true);
  }

  // Comprobar que todos los materiales están completados
  // SIGUIENTE: Podríamos dejar la opción de que no ponga todos los materiales por si faltan de alguno
  allMaterialsCompleted(): boolean {
    return Array.from(this.completed.values()).every(completed => completed);
  }

  // Completar la tarea
  completeTask() {
    if (this.allMaterialsCompleted()) {
      this.taskService.completeTaskById(this.taskId, this.userActual.id).then(() => {

        this.animationService.activarAnimacion('/tareasdiarioalumno', true);
      });
    } else {
      // alert('No se pueden guardar los menús, hay clases sin completar.');
    }
  }

  // Salir de la página
  salir() {
    this.router.navigate(['/tareasdiarioalumno']);
  }

  // Obtener la dirección de un pictograma número
  getNumPict(num: number): string {
    return `../../../assets/imagenes/numbers/${num}.png`;
  }
}
