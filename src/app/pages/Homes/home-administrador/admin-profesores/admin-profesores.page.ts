import { Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TeacherI } from 'src/app/common/models/teacher.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { Router } from '@angular/router';
import { TeacherService } from 'src/app/common/services/teacher.service';
import { StudentService } from 'src/app/common/services/student.service';
import { TasksService } from 'src/app/common/services/tasks.service';
import { PictogramSearchComponent } from 'src/app/shared/pictogram-search/pictogram-search.component';
import { AlertController } from '@ionic/angular';
import { IonContent } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { LOCALE_ID } from '@angular/core';

registerLocaleData(localeEs);

@Component({
  selector: 'app-admin-profesores',
  templateUrl: './admin-profesores.page.html',
  styleUrls: ['./admin-profesores.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, PictogramSearchComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})


export class AdminProfesoresPage{
  //Esto lo uso para cuando edito tarea, que scrollee hasta arriba del todo
  @ViewChild(IonContent, { static: false }) content: IonContent;

  //Profesores
  teachers: TeacherI[] = [];
  newTeacher: TeacherI;
  teacher: TeacherI;

  userActual: TeacherI;

  showTeacherForm: boolean = false;

  //Subject
  private unsubscribe$ = new Subject<void>();

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly teacherService: TeacherService,
    private readonly studentService: StudentService,
    private readonly taskService: TasksService,
    private alertController: AlertController
  ) {
    
    this.load();
    this.init();
   
    //Profs
    this.getTeacher();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
  init(){

    //Miro que admin ha iniciado sesion
    const user = this.sessionService.getCurrentUser();


    // Inicializa los objetos de profesor, estudiante, tarea y descripcion de la tarea
    this.newTeacher = this.teacherService.initTeacher();
  }

  // Método para cargar los datos de la base de datos
  load(){
    // Profesores
    this.firestoreService.getCollectionChanges<TeacherI>('Teachers')
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        if (data) {
          this.teachers = data;
          console.log('Profesores -> ', this.teachers);
        }
      });
  }

  // GETTERS
  // Método para obtener un profesor de la base de datos
  getTeacher(){
    // const res = await this.firestoreService.getDocument<TeacherI>('Teachers/'+ this.newTeacher.id);
    // this.teacher = res.data();
    this.teacherService.getTeacher(this.newTeacher.id).then((teacher) => {
      this.teacher = teacher;
    });
    console.log('Profesor:', this.teacher);
  }


  // Método para añadir o actualizar un profesor según el DNI
  addTeacher() {

    // this.newTeacher.id = this.firestoreService.createIDDoc();

    // await this.firestoreService.createDocumentID(this.newTeacher, 'Teachers', this.newTeacher.id);
    this.teacherService.addTeacher(this.newTeacher);
    
    this.showTeacherForm = false;
    // Limpiar el formulario y ocultar
    this.teacherService.cleanTeacherInterface(this.newTeacher);
  }
    
 // Método para editar un profesor
   editTeacher(teacher: TeacherI){
    // console.log('edit -> ', teacher);
    this.teacherService.editTeacher(teacher);
    this.newTeacher = teacher;
  }

  // Método para eliminar un profesor de la base de datos
  deleteTeacher(teacher: TeacherI){
  //   console.log('delete -> ',teacher.id);
  //   await this.firestoreService.deleteDocumentID('Teachers', teacher.id);
    this.teacherService.deleteTeacher(teacher.id);
    console.log('delete teacher -> ',teacher.name, teacher.surname);

  }

  toggleTeacherForm() {
    this.showTeacherForm = !this.showTeacherForm;
  }

  comeback(){
    this.router.navigate(['/homeadministrador']);
  }
}


  