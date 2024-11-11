import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../common/modules/ionicons.module';
import { Router } from '@angular/router';
import { FirestoreService } from '../../common/services/firestore.service';
import { UserI } from '../../common/models/users.models';

@Component({
  selector: 'app-login',
  templateUrl: './login-profesor.page.html',
  styleUrls: ['./login-profesor.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule],
})
export class LoginPage implements OnInit {
  name: string;
  password: string;

  constructor(private router: Router, private firestoreService: FirestoreService) { }

  ngOnInit() {}

  async login() {
    try {
      const userId = await this.firestoreService.getDocumentIDByField('Usuarios', 'nombre', this.name);

      if (userId) {
        const userDoc = await this.firestoreService.getDocument<UserI>(`Usuarios/${userId}`);
        const userData = userDoc.data();

        console.log('userData -> ', userData);

        if (userData && userData.password === this.password) {
          this.router.navigate(['/homeprofesor']);
        } else {
          console.log('Contraseña incorrecta');
        }
      } else {
        console.log('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al autenticar usuario', error);
    }
  }
}
