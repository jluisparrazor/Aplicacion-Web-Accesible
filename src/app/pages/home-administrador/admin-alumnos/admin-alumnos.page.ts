import { Component, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { StudentI } from 'src/app/common/models/student.models';;
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
  selector: 'app-admin-alumnos',
  templateUrl: './admin-alumnos.page.html',
  styleUrls: ['./admin-alumnos.page.scss'],
  standalone: true,
  imports: [IonicModule, FormsModule, CommonModule, RouterModule, PictogramSearchComponent],
  providers: [{ provide: LOCALE_ID, useValue: 'es-ES' }],
})


export class AdminAlumnosPage{
  //Esto lo uso para cuando edito tarea, que scrollee hasta arriba del todo
  @ViewChild(IonContent, { static: false }) content: IonContent;

  //Alumnos
  students: StudentI[] = [];
  newStud: StudentI;
  stud: StudentI;

  selectedStudent: StudentI; // Estudiante al que se asignará la tarea
  
  //Formularios
  showStudentForm: boolean = false;

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

    this.getStudent();

  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
 
  init(){

    //Miro que admin ha iniciado sesion
    const user = this.sessionService.getCurrentUser();

    /*if (user as TeacherI && (user as TeacherI).administrative) {
      this.userActual = user as unknown as TeacherI;
      console.log('Administrador loggeado:', this.userActual.name);
    } else {
      console.error('El usuario actual no es válido o no tiene permisos de administrador. ->' , user);
      this.router.navigate(['/loginprofesor']); // Redirigir al login de administrador
      return; // Detenemos la ejecución si el usuario no es válido
    }*/
    this.newStud = this.studentService.initStudent();
  }

  // Método para cargar los datos de la base de datos
  load(){
    
    // Estudiantes
    this.firestoreService.getCollectionChanges<StudentI>('Students')
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe((data) => {
      if (data) {
        this.students = data;
        console.log('Estudiantes -> ', this.students);
      }
    });
  }

  // GETTERS

  // Método para obtener un estudiante de la base de datos
  getStudent(){
  //   const res = await this.firestoreService.getDocument<StudentI>('Students/'+ this.newStud.id);
  //   this.stud = res.data();
  this.studentService.getStudent(this.newStud.id).then((student) => {
    this.stud = student;
  });
  console.log('Estudiante:', this.stud);  
  }

  //~~~~~~~~~~~~~~~~~~~~~~~~~Student section~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Método para añadir un nuevo estudiante a la base de datos (estudiante no existente en la BD)
  addStud(){
    // Hacer comprobación para que al menos estén rellenos los campos obligatorios
    // this.newStud.id = this.firestoreService.createIDDoc();
    // await this.firestoreService.createDocumentID(this.newStud, 'Students', this.newStud.id);
    // this.showStudentForm = false;  // Oculta el formulario después de guardar
    // this.cleanInterfaceStud();
    this.studentService.addStudent(this.newStud);
    
    this.showStudentForm = false;
    // Limpiar el formulario y ocultar
    this.studentService.cleanStudentInterface(this.newStud);
 
  }
      
  // Método para guardar nuevos datos de un estudiante (ya existente) en la base de datos
  async saveStudent(){
    await this.firestoreService.createDocumentID(this.newStud, 'Students', this.newStud.id);
  }

  // Método para editar un estudiante
  editStu(student: StudentI){
    this.studentService.editStudent(student);
    this.newStud = student;
  }

  // Método para eliminar un estudiante de la base de datos
  deleteStu(student: StudentI){
    this.studentService.deleteStudent(student.id);
    console.log('delete student -> ',student.name, student.surname);
  }

  toggleStudentForm() {
    console.log('toggleStudentForm activated');
    this.showStudentForm = !this.showStudentForm;
  }

}