import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonList, IonButton, IonIcon, IonCard, IonCardTitle, IonButtons, IonItem, IonLabel, IonImg, IonThumbnail, IonInput, IonRow, IonGrid, IonCol, IonAlert } from '@ionic/angular/standalone';
import { Class } from 'src/app/common/models/class.models';
import { ClassService } from 'src/app/common/services/class.service';
import { PictogramSearchComponent } from "../../shared/pictogram-search/pictogram-search.component";
import { ChangeDetectorRef } from '@angular/core';
import { AlertService } from 'src/app/common/services/alert.service';
import { ArasaacService } from 'src/app/common/services/arasaac.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.page.html',
  styleUrls: ['./classes.page.scss'],
  standalone: true,
  imports: [IonCol, IonGrid, IonRow, IonInput, IonImg, IonLabel, IonItem, IonButtons, IonCard, IonIcon, IonButton, IonList, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, PictogramSearchComponent, IonThumbnail]
})
export class ClassesPage implements OnInit {

  classes: Class[] = [];
  showClassForm: boolean = false;
  actualClass: Class = { id: '', name: '', pictogramId: '' };
  editedClass: Class | null = null;
  editingClass: boolean = false;
  arasaacService: any;

  constructor(
    private classService: ClassService,
    private cdr: ChangeDetectorRef,
    private alertService: AlertService,
    private arasaac: ArasaacService) {
    this.arasaacService = arasaac;
  }

  ngOnInit() {
    this.loadStructure();
  }

  async loadStructure() {
    this.classService.getAllClasses().subscribe((data) => {
      this.classes = data;
    })
  }

  salir() {
    // Implement navigation to home
  }

  addClass() {
    if (this.actualClass.name.trim() !== "") { // Verifica que el nombre no esté vacío o solo contenga espacios
      this.classService.createClass(this.actualClass).then(() => {
        this.loadStructure();
        this.classFormFunciton();
      });
    } else {
      this.alertService.showAlert("Alerta", "Tiene que rellenar el campo Nombre");
    }
  }

  saveClass() {
    if (this.actualClass.name.trim() !== "") { // Verifica que el nombre no esté vacío o solo contenga espacios
      if (this.actualClass.name !== this.editedClass?.name || this.actualClass.pictogramId !== this.editedClass?.pictogramId) { // Comprobamos que haya cambiado
        this.classService.updateClass(this.actualClass).then(() => {
          this.loadStructure();
          this.classFormFunciton();
        });
      } else {
        this.classFormFunciton();
      }
      this.editedClass = null;
    } else {
      this.alertService.showAlert("Alerta", "Tiene que rellenar el campo Nombre");
    }
  }

  editClass(cls: Class) {
    this.editedClass = cls;
    this.actualClass = { ...cls };
    this.editingClass = true;
    this.classFormFunciton();
  }

  deleteClass(cls: Class) {
    if (this.alertService.showConfirm("Confirmar acción", `Deseas eliminar la clase ${cls.name}?`)) {
      this.classService.deleteClass(cls.id).then(() => {
        this.loadStructure();
      });
    }
  }

  classFormFunciton() {
    this.showClassForm = !this.showClassForm;
    if (!this.showClassForm) {
      this.actualClass = { id: '', name: '', pictogramId: '' };
      this.editingClass = false;
    }
  }
}