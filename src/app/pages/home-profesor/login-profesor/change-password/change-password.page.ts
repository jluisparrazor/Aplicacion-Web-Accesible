import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonItem, IonInput, IonButton, IonCol, IonGrid, IonRow, IonCardContent, IonCard, IonCardHeader, IonCardTitle, IonLabel } from '@ionic/angular/standalone';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { AlertService } from 'src/app/common/services/alert.service';
import { Router } from '@angular/router';
import { TeacherI } from 'src/app/common/models/teacher.models';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonInput, IonGrid, IonButton, IonItem, IonContent, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonLabel, CommonModule, FormsModule]
})
export class ChangePasswordPage {

  message: string = 'Se ha enviado un enlace de recuperación a tu correo electrónico.'; 
  email_input: string = ''; 
  header: string = 'Recuperar contraseña';
  buttonText: string = "OK";
  failed_message: string = 'No se encontró ningún profesor con ese correo electrónico.';
  teacher: TeacherI | null = null;
  dni_input: string = '';
  new_password: string = '';
  confirm_password: string = '';

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly router: Router,
    private readonly alertService: AlertService
  ) {}

  async recoverPassword() {
    console.log('Email:', this.email_input);

    try {
      // Intenta recuperar la contraseña desde Firestore
      const teacher = await this.firestoreService.getTeacherByEmail(this.email_input);
      console.log("Profesor encontrado ->", JSON.stringify(teacher));
      
      if (teacher) {
        this.teacher = teacher;
        // Activar formulario de recuperación de contraseña
      } else {
        this.alertService.showAlert(this.header, this.failed_message, this.buttonText); 
      }
    } catch (error) {
      console.log('Hubo un error al intentar recuperar la contraseña. Por favor, inténtalo de nuevo más tarde.', error);
    }
  }

  async verifyDniAndChangePassword() {
    if (this.teacher && this.teacher.dni === this.dni_input) {
      if (this.new_password === this.confirm_password) {
        try {
          const teacher_ref= this.firestoreService.getDocumentReference('Teachers', this.teacher.id);
          await this.firestoreService.updateDocument(teacher_ref, { password: this.new_password });
          this.alertService.showAlert(this.header, 'Contraseña cambiada con éxito', this.buttonText);
          this.teacher = null;
          this.dni_input = this.email_input = this.email_input = this.new_password = this.confirm_password = ''; //Limpiamos los campos
          this.teacher = null;
          this.router.navigate(['/loginprofesor']);
        } catch (error) {
          console.log('Hubo un error al cambiar la contraseña. Por favor, inténtalo de nuevo más tarde.', error);
        }
      } else {
        this.alertService.showAlert(this.header, 'Las contraseñas no coinciden', this.buttonText);
      }
    } else {
      this.alertService.showAlert(this.header, 'DNI incorrecto', this.buttonText);
    }
  }
}
