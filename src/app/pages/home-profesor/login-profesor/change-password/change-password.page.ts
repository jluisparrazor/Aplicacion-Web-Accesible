import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonItem, IonLabel, IonButton } from '@ionic/angular/standalone';
import { StudentI } from 'src/app/common/models/student.models';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  standalone: true,
  imports: [IonButton, IonLabel, IonItem, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChangePasswordPage {

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  user:StudentI;

  constructor(
    private firestoreService: FirestoreService,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) {
  }

  async presentAlert(header: string, message: string){
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async getUser(){

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
