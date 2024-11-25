import { Component } from '@angular/core';
import { IonContent, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from '../../../common/modules/ionicons.module';
import { Router } from '@angular/router';
import { FirestoreService } from '../../../common/services/firestore.service';
import { SessionService } from 'src/app/common/services/session.service';
import { ProfI } from '../../../common/models/profesor.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login-profesor.page.html',
  styleUrls: ['./login-profesor.page.scss'],
  standalone: true,
  imports: [
    IonContent, IonItem, FormsModule, IonButton, IoniconsModule, CommonModule, IonInput
  ],
})
export class LoginPage{
  name: string = '';
  password: string = '';
  errorMessage: string = ''; // Variable para almacenar el mensaje de error

  constructor(
    private readonly router: Router,
    private readonly firestoreService: FirestoreService,
    private sessionService: SessionService
  ) { }


  async login() {
    try {

    // Eliminamos los espacios en blanco al inicio o al final de los inputs
    //const trimmedName = name; this.name?.trim(); //Con .? se asegura de que no sea null y no haga un trim a null que da error
    //const trimmedPassword = this.password?.trim();
    
    // Validar que los campos no estén vacíos después de eliminar los espacios
    if (!this.name || !this.password) {
      console.log('Por favor, ingrese un nombre y una contraseña válidos.'
        + 'Los introducidos son ->', this.name + ' y ' + this.password);
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
        if (profData && profData.Password === this.password) {
          // Redirigimos a la página de inicio según si es administrativo o profesor
          if(profData.Administrativo === true){
            this.sessionService.setCurrentUser(profData, 'admin');
            this.router.navigate(['/homeadministrador']);
          }
          else{
            this.sessionService.setCurrentUser(profData, 'profesor');
            this.router.navigate(['/homeprofesor']);
          }                                       

        } else {
          console.log('Contraseña incorrecta');
          this.errorMessage = 'Contraseña incorrecta.'; // Mensaje si la contraseña no coincide

        }
      } else {
        this.errorMessage = 'Usuario no encontrado.'; // Mensaje si el usuario no existe
        console.log('Usuario no encontrado');
      }

    } catch (error) {
      console.error('Error al autenticar usuario', error);
      this.errorMessage = 'Ocurrió un error al iniciar sesión. Por favor, intente nuevamente.';
    }
  }
}
