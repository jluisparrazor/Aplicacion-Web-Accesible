import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonLabel, IonItem, IonCard, IonInput, IonButton, IonGrid, IonRow, IonCol, IonCardHeader, IonCardTitle, IonCardContent, IonThumbnail, IonImg, IonIcon, IonButtons } from '@ionic/angular/standalone';
import { AlertService } from 'src/app/common/services/alert.service';
import { TeacherI } from 'src/app/common/models/teacher.models';
import { TeacherService } from 'src/app/common/services/teacher.service';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PictogramSearchComponent } from 'src/app/shared/pictogram-search/pictogram-search.component';

@Component({
  selector: 'app-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
  standalone: true,
    imports: [IonButtons, IonIcon, IonImg, IonCardContent, IonCardTitle, IonCardHeader, IonCol, IonRow, IonGrid, IonButton, IonButtons, IonInput, IonCard, IonHeader,IonThumbnail, IonToolbar, IonTitle,
      IonContent, IonLabel, IonItem, IonButton, FormsModule, CommonModule, PictogramSearchComponent]})
  
export class MiPerfilPage implements OnInit {
  teacher: TeacherI | null = null;

  // Variables para editar los datos del profesor
  name: string = '';
  surname: string = '';
  dni: string = '';
  pictogramId: string = '';
  email: string = '';
  password: string = '';
  administrative: boolean = false;
  birthdate?: Date;
  phone?: number;
  id : string = ''; //Id Paula
  constructor(
    private alertService: AlertService,
    private router: Router,
    private teacherService: TeacherService,
    private sesionService: SessionService
  ) {}

  ngOnInit() {
    this.loadTeacherData();
  }

  async loadTeacherData() {
    try {
      this.teacher = this.sesionService.getCurrentUser() as TeacherI;
      if (this.teacher) {
        // Cargar datos del profesor en las variables
        this.name = this.teacher.name;
        this.surname = this.teacher.surname;
        this.dni = this.teacher.dni;
        this.pictogramId = this.teacher.pictogramId;
        this.email = this.teacher.email;
        this.password = this.teacher.password;
        this.administrative = this.teacher.administrative;
        this.birthdate = this.teacher.birthdate;
        this.phone = this.teacher.phone;
      } else {
        // this.alertService.showAlert('Error', 'No se encontró el profesor', 'OK');
        this.router.navigate(['/loginprofesor']);
      }
    } catch (error) {
      console.error('Error al cargar datos del profesor:', error);
    }
  }

  async updateTeacherData() {
    let updatedData: TeacherI = null;
    // Si es administrativo puede tocar opciones que no puede un profesor
    if (this.teacher.administrative) {
        updatedData={
        id: this.teacher.id,
        name: this.name,
        surname: this.surname,
        dni: this.dni,                                //Solo para admins
        pictogramId: this.pictogramId,
        email: this.email,                            //Solo para admins
        password: this.password,
        administrative: this.administrative,          //Solo para admins
        birthdate: this.birthdate,
        phone: this.phone
      
    }
  }
    else{
      updatedData= {
        id: this.teacher.id, 
        name: this.name,
        surname: this.surname,
        dni: this.teacher.dni,
        pictogramId: this.pictogramId,
        email: this.teacher.email,
        password: this.password,
        administrative: this.teacher.administrative,
        birthdate: this.birthdate,
        phone: this.phone
      }
    }
      this.teacherService.editTeacher(updatedData);
    }
    comeback(){
      if(!this.teacher.administrative)
        this.router.navigate(['/homeprofesor']);
      else
        this.router.navigate(['/homeadministrador']);
    }
}
