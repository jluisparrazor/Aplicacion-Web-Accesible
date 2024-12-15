import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonList, IonItem, IonCard, IonInput, IonButton, IonSpinner, IonIcon, IonButtons, IonGrid, IonCol, IonRow, IonImg } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import { IoniconsModule } from 'src/app/common/modules/ionicons.module';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { SessionService } from 'src/app/common/services/session.service';
import { StudentI } from 'src/app/common/models/student.models';

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
  cargando: boolean = false;
  alumno: StudentI;
  circles = [
    { correct: false, incorrect: false, src: '' },
    { correct: false, incorrect: false, src: '' },
    { correct: false, incorrect: false, src: '' }
  ];
  pictogramsEnabled: boolean = true; // Nueva bandera para controlar la habilitación de los pictogramas

  constructor(private firestoreService: FirestoreService, private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    const currentUser = this.sessionService.getCurrentUser() as StudentI;
    if (currentUser) {
      this.name = currentUser.name;
      this.alumno = currentUser;
      this.loadCorrectPassword(currentUser.id);
    }
  }

  /**
   * Loads the correct password for the given user ID from Firestore.
   * 
   * @param userId - The ID of the user.
   */
  loadCorrectPassword(userId: string) {
    this.firestoreService.getDocument<StudentI>(`Students/${userId}`).then(docSnap => {
      if (docSnap.exists()) {
        const user = docSnap.data();
        if (user && user.correctPassword) {
          this.correctPassword = user.correctPassword;
        }
      }
    });
  }

  /**
   * Handles the selection of a pictogram.
   * 
   * @param index - The index of the selected pictogram.
   */
  selectPictogram(index: number) {
    if (!this.pictogramsEnabled) {
      return;
    }

    const selectedId = this.pictograms[index].id;
    const currentIndex = this.selectedPictograms.length;
    this.selectedPictograms.push(selectedId);

    if (selectedId === this.correctPassword[currentIndex]) {
      this.circles[currentIndex].correct = true;
      this.circles[currentIndex].src = this.pictograms[index].src;
    } else {
      this.circles[currentIndex].incorrect = true;
      this.circles[currentIndex].src = 'https://api.arasaac.org/api/pictograms/5504';
      this.errorMessage = 'Contraseña incorrecta';
      this.pictogramsEnabled = false;
      setTimeout(() => {
        this.resetIncorrectCircles();
        this.selectedPictograms = this.selectedPictograms.slice(0, currentIndex);
        this.pictogramsEnabled = true;
      }, 1000);
      return;
    }

    if (this.selectedPictograms.length === this.correctPassword.length) {
      if (this.isPasswordCorrect()) {
        console.log('Login exitoso');
        this.errorMessage = '';
        this.router.navigate(['/tareasdiarioalumno']);
      } else {
        this.errorMessage = 'Contraseña incorrecta';
        this.pictogramsEnabled = false;
        setTimeout(() => {
          this.resetIncorrectCircles();
          this.selectedPictograms = this.selectedPictograms.slice(0, currentIndex);
          this.pictogramsEnabled = true;
        }, 1000);
      }
    }
  }

  /**
   * Checks if the selected pictograms match the correct password.
   * 
   * @returns True if the selected pictograms match the correct password, false otherwise.
   */
  isPasswordCorrect(): boolean {
    return this.selectedPictograms.every((val, index) => val === this.correctPassword[index]);
  }

  /**
   * Resets the incorrect circles to their initial state.
   */
  resetIncorrectCircles() {
    this.circles.forEach((circle, index) => {
      if (circle.incorrect) {
        circle.correct = false;
        circle.incorrect = false;
        circle.src = '';
      }
    });
  }
}