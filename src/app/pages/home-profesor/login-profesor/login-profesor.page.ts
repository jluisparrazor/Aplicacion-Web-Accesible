import { Component } from '@angular/core';
import { IonContent, IonItem, IonButton } from '@ionic/angular/standalone';
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
  imports: [
    IonContent, IonItem, FormsModule, IonButton, IoniconsModule
  ],
})
export class LoginPage{
  name: string;
  password: string;

  constructor(private readonly router: Router, private readonly firestoreService: FirestoreService) { }


  async login() {
    try {

    // Eliminamos los espacios en blanco al inicio o al final de los inputs
    const trimmedName = this.name?.trim() || '';
    const trimmedPassword = this.password?.trim() || '';
    
    // Validar que los campos no estén vacíos después de eliminar los espacios
    if (!trimmedName || !trimmedPassword) {
      console.log('Por favor, ingrese un nombre y una contraseña válidos.');
      return;
    }

    // Verificamos si el profesor existe en la base de datos
      const profId = await this.firestoreService.getDocumentIDByField('Profesores', 'Nombre', this.name);
    
    //Si existe el profesor, obtenemos sus datos
      if (profId) {
        const profDoc = await this.firestoreService.getDocument<ProfI>(`Profesores/${profId}`);
        const profData = profDoc.data();

        // console.log('profData -> ', profData);

        // Verificamos que sea el profesor inserte la contraseña correcta 
        if (profData && profData.Password === trimmedPassword) {


          // Redirigimos a la página de inicio según si es administrativo o profesor
          if(profData.Administrativo === true)
            this.router.navigate(['/homeadministrador']);
          else
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
