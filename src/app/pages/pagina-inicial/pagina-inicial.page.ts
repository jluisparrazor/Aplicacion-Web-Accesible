import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonSpinner, IonList, IonImg, IonGrid, IonRow, IonCol, IonFooter, IonButton, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { PictogramSearchComponent } from 'src/app/shared/pictogram-search/pictogram-search.component';
import { FirestoreService } from 'src/app/common/services/firestore.service';
import { StudentI } from 'src/app/common/models/student.models';
import { RouterModule, Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service'; // Importa SessionService

@Component({
  selector: 'app-pagina-inicial',
  templateUrl: './pagina-inicial.page.html',
  styleUrls: ['./pagina-inicial.page.scss'],
  standalone: true,
  imports: [IonIcon, IonImg, IonList, IonSpinner, IonItem, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonGrid, IonRow, IonCol, IonFooter, IonButton, IonButtons, RouterModule]
})
export class PaginaInicialPage implements OnInit {
  alumnos: StudentI[] = [];
  paginatedAlumnos: StudentI[][][] = [];
  currentPage: number = 0;
  itemsPerPage: number = 9;
  cargando: boolean = false;

  constructor(private firestoreService: FirestoreService, private router: Router, private sessionService: SessionService) { }

  ngOnInit() {
    this.loadAlumnos();
  }

  loadAlumnos() {
    this.cargando = true;
    this.firestoreService.getCollectionChanges<StudentI>('Students').subscribe((data) => {
      if (data) {
        this.alumnos = data;
        this.paginateAlumnos();
      }
      this.cargando = false;
    });
  }

  paginateAlumnos() {
    this.paginatedAlumnos = [];
    for (let i = 0; i < this.alumnos.length; i += this.itemsPerPage) {
      const page = this.alumnos.slice(i, i + this.itemsPerPage);
      const rows = [];
      for (let j = 0; j < page.length; j += 3) {
        rows.push(page.slice(j, j + 3));
      }
      this.paginatedAlumnos.push(rows);
    }
  }

  seleccionarAlumno(alumno: StudentI) {
    this.sessionService.setCurrentUser(alumno, 'student');
    this.router.navigate(['/tareasdiarioalumno']);
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  nextPage() {
    if (this.currentPage < this.paginatedAlumnos.length - 1) {
      this.currentPage++;
    }
  }

  hasMorePages() {
    return this.currentPage < this.paginatedAlumnos.length - 1;
  }
}