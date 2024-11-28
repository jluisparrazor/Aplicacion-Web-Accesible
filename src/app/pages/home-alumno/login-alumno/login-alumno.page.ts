import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from 'src/app/common/modules/ionicons.module';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { SessionService } from 'src/app/common/services/session.service';
import { UserI } from 'src/app/common/models/users.models';

@Component({
  selector: 'app-login',
  templateUrl: './login-alumno.page.html',
  styleUrls: ['./login-alumno.page.scss'],
  standalone: true,
  imports: [CommonModule, IonImg, IonRow, IonCol, IonGrid, IonButtons, IonIcon, IonSpinner, IonButton, IonInput, IonCard, IonHeader, IonToolbar, IonTitle,
    IonContent, IonList, IonLabel, IonItem, FormsModule, IonButton, IonSpinner, IoniconsModule],
})

export class LoginAlumnoPage implements OnInit {
  name: string;
  password: string;
  pictograms = [
    { src: 'https://api.arasaac.org/api/pictograms/34120', id: 1 },
    { src: 'https://api.arasaac.org/api/pictograms/34045', id: 2 },
    { src: 'https://api.arasaac.org/api/pictograms/2400', id: 3 },
    { src: 'https://api.arasaac.org/api/pictograms/2561', id: 4 },
    { src: 'https://api.arasaac.org/api/pictograms/10235', id: 5 },
    { src: 'https://api.arasaac.org/api/pictograms/8594', id: 6 }
  ];
  selectedPictograms: number[] = [];
  correctPassword: number[] = [];
  errorMessage: string = '';
  circles = [
    { correct: false, incorrect: false },
    { correct: false, incorrect: false },
    { correct: false, incorrect: false }
  ];

  constructor(private firestoreService: FirestoreService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    const currentUser = this.sessionService.getCurrentUser() as UserI;
    if (currentUser) {
      this.name = currentUser.nombre;
      this.loadCorrectPassword(currentUser.id);
    }
  }

  loadCorrectPassword(userId: string) {
    this.firestoreService.getDocument<UserI>(`Usuarios/${userId}`).then(docSnap => {
      if (docSnap.exists()) {
        const user = docSnap.data();
        if (user && user.correctPassword) {
          this.correctPassword = user.correctPassword;
        }
      }
    });
  }

  selectPictogram(index: number) {
    const selectedId = this.pictograms[index].id;
    const currentIndex = this.selectedPictograms.length;
    this.selectedPictograms.push(selectedId);

    if (selectedId === this.correctPassword[currentIndex]) {
      this.circles[currentIndex].correct = true;
    } else {
      this.circles[currentIndex].incorrect = true;
      this.errorMessage = 'Contraseña incorrecta';
      setTimeout(() => {
        this.resetIncorrectCircles(); // Reiniciar solo los círculos incorrectos
        this.selectedPictograms = this.selectedPictograms.slice(0, currentIndex); // Mantener solo los correctos
      }, 200); // Espera 1 segundo antes de reiniciar los incorrectos
      return;
    }

    if (this.selectedPictograms.length === this.correctPassword.length) {
      if (this.isPasswordCorrect()) {
        // Lógica para iniciar sesión
        console.log('Login exitoso');
        this.errorMessage = '';
        this.router.navigate(['/tareasdiarioalumno']); // Navegar al perfil del alumno
      } else {
        // Mostrar mensaje de error
        this.errorMessage = 'Contraseña incorrecta';
        setTimeout(() => {
          this.resetIncorrectCircles(); // Reiniciar solo los círculos incorrectos
          this.selectedPictograms = this.selectedPictograms.slice(0, currentIndex); // Mantener solo los correctos
        }, 1000); // Espera 1 segundo antes de reiniciar los incorrectos
      }
    }
  }

  isPasswordCorrect(): boolean {
    return this.selectedPictograms.every((val, index) => val === this.correctPassword[index]);
  }

  resetIncorrectCircles() {
    this.circles.forEach((circle, index) => {
      if (circle.incorrect) {
        circle.correct = false;
        circle.incorrect = false;
      }
    });
  }
}