import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList , IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonRow, IonCol, IonImg, IonAvatar } from '@ionic/angular/standalone';
import { TeacherI } from '../../common/models/teacher.models';
import { StudentI } from '../../common/models/student.models';
import { FirestoreService } from '../../common/services/firestore.service';

import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home-profesor.page.html',
  styleUrls: ['home-profesor.page.scss'],
  standalone: true,
  imports: [IonAvatar, IonImg, IonCol, IonRow, IonGrid, IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule, CommonModule,RouterModule]})
export class HomePage {
  students: StudentI[] = [];
  userActual: TeacherI;
  sessionSubscription: Subscription;

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly sessionService: SessionService,
    private readonly router: Router,
    // private readonly studentService: StudentService,
  ) {
    this.load();

    //Students
    
    this.firestoreService.getCollectionChanges<StudentI>('Students').subscribe((data) => {
      if (data) {
        this.students = data;
        console.log('Estudiantes -> ', this.students);
      }
    });  
  }

  load(){
    this.sessionSubscription = this.sessionService.getSessionObservable().subscribe(user => {    //Miro que profesor ha iniciado sesión
    if (user as TeacherI && !(user as TeacherI).administrative) {
      this.userActual = user as unknown as TeacherI;
      console.log('Profesor no admin loggeado:', this.userActual.name);
    } else {
      
      console.error('El usuario actual no es válido o no tiene permisos de profesor. ->' , user);
      this.router.navigate(['/loginprofesor']); // Redirigir al login de administrador
    }
  });
}
  
  logout() { 
    this.sessionService.clearSession(); 
    this.router.navigate(['/loginprofesor']); 
  }

}