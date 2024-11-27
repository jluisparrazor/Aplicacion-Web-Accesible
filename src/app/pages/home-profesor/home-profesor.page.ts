import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonRow, IonCol, IonImg, IonAvatar } from '@ionic/angular/standalone';
import { TeacherI } from '../../common/models/teacher.models';
import { StudentI } from '../../common/models/student.models';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { StudentService } from 'src/app/common/services/student.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home-profesor.page.html',
  styleUrls: ['home-profesor.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonImg, IonCol, IonRow, IonGrid, IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule, CommonModule 

})
export class HomePage {
  students: StudentI[] = [];
 
  userActual: TeacherI;

  constructor(
    private readonly sessionService: SessionService,
    private readonly router: Router,
    private readonly studentService: StudentService,
  ) {
    this.load();

    //Students
    this.loadStudents();
  }

  load(){
    //Miro que profesor ha iniciado sesion
    const user = this.sessionService.getCurrentUser();

    if (user as TeacherI && !(user as TeacherI).administrative) {
      this.userActual = user as unknown as TeacherI;
      console.log('Profesor no admin loggeado:', this.userActual.name);
    } else {
      console.error('El usuario actual no es válido o no tiene permisos de administrador. ->' , user);
      this.router.navigate(['/loginprofesor']); // Redirigir al login de administrador
    }
  }
 
  loadStudents(){
  // Carga los estudiantes de la base de datos
  this.studentService.loadStudents().then((students) => {
    this.students = students;
  });
  }
}