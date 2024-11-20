import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../../common/modules/ionicons.module';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../common/services/firestore.service';
import { ProfI } from '../../../common/models/profesor.models';

@Component({
  selector: 'app-login',
  templateUrl: './login-profesor.page.html',
  styleUrls: ['./login-profesor.page.scss'],
  standalone: true,
  imports: [IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule],
})
export class LoginPage{
  name: string;
  password: string;

  constructor(private router: Router, private firestoreService: FirestoreService) { }


  async login() {
    try {
      const profId = await this.firestoreService.getDocumentIDByField('Profesores', 'Nombre', this.name);

      if (profId) {
        const profDoc = await this.firestoreService.getDocument<ProfI>(`Profesores/${profId}`);
        const profData = profDoc.data();

        console.log('profData -> ', profData);

        // Verificamos que sea el usuario inserte la contraseña correcta 
        if (profData && profData.Password === this.password) {
          // Redirigimos a la página de inicio según si es administrativo o profesor
          if(profData.Administrativo === true)
            this.router.navigate(['/homeadministrador']);//Cambiar por homeadministrador,
          else                                           //registrosemanaltareas es solo para probar
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
