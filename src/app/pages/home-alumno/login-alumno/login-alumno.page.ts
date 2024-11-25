import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from 'src/app/common/modules/ionicons.module';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { UserI } from 'src/app/common/models/users.models';

@Component({
  selector: 'app-login',
  templateUrl: './login-alumno.page.html',
  styleUrls: ['./login-alumno.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule],
})
export class LoginAlumnoPage{
  name: string;
  password: string;

  constructor(private router: Router, private firestoreService: FirestoreService) { }

  async loginAlumno() {
    try {
      const userId = await this.firestoreService.getDocumentIDByField('Usuarios', 'nombre', this.name);

      if (userId) {
        const userDoc = await this.firestoreService.getDocument<UserI>(`Usuarios/${userId}`);
        const userData = userDoc.data();

        console.log('userData -> ', userData);

        // Verificamos que sea el usuario inserte la contraseña correcta 
        if (userData && userData.password === this.password) {
          this.router.navigate(['/registrosemanaltareas']);//Cambiar por homealumno, lo de tareas es ara probar
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