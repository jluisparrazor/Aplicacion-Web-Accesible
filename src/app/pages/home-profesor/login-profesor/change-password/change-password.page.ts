import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonItem, IonLabel, IonButton, IonText, IonGrid, IonCol, IonRow } from '@ionic/angular/standalone';
// import { StudentI } from 'src/app/common/models/student.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/common/services/alert.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonRow, IonCol, IonGrid, IonButton, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChangePasswordPage {

  message: string = 'Se ha enviado un enlace de recuperación a tu correo electrónico.'; 
  email: string = null; 
  header: string = 'Recuperar contraseña';
  // user:StudentI;
  buttonText: string = "OK";
  failed_message : string = 'No se encontró ningún profesor con ese correo electrónico.';
  constructor(
    private firestoreService: FirestoreService,
    // private alertCtrl: AlertController,
    private navCtrl: NavController,
    private alertService: AlertService
  ) {
  }

  // async presentAlert(header: string, message: string){
  //   const alert = await this.alertCtrl.create({
  //     header,
  //     message,
  //     buttons: ['OK']
  //   });
  //   await alert.present();
  // }

  // async getUser(){

  // }

  async recoverPassword() {
    console.log('Email:', this.email);

    try {

      // Intenta recuperar la contraseña desde Firestore
      const teacher = await this.firestoreService.getTeacherByEmail(this.email);
      console.log("Profesor encontrado ->" + teacher);
      
      if (teacher) {
        // Aquí enviarías un correo electrónico de recuperación
        this.alertService.showAlert(this.header, this.message, this.buttonText); 
        } else {
        this.alertService.showAlert(this.header, this.failed_message, this.buttonText); 
      }
    } catch (error) {
      console.log('Hubo un error al intentar recuperar la contraseña. Por favor, inténtalo de nuevo más tarde.');
    }
  }

  // async changePassword(){
  //   if(this.currentPassword === this.user){
  //     if(this.newPassword === this.confirmPassword){
  //       this.user.password = this.newPassword;
  //      // await this.firestoreService.updateDocument(this.user, 'Usuarios', this.user.id);
  //       this.navCtrl.navigateForward('homeprofesor');
  //     }else{
  //       this.presentAlert('Error', 'Las contraseñas no coinciden');
  //     }
  //   }else{
  //     this.presentAlert('Error', 'La contraseña actual es incorrecta');
  //   }
  // }
  

}
