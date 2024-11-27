import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonModal, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonFooter, IonImg } from '@ionic/angular/standalone';
import { Class } from '../../common/models/class.models'; 
import { MenuType, Menu } from '../../common/models/menu.models'; 
import { Timestamp } from 'firebase/firestore';
import { ClassService } from '../../common/services/class.service';
import { MenuService } from '../../common/services/menu.service';
import { ArasaacService } from 'src/app/common/services/arasaac.service';


@Component({
  selector: 'app-choose-menus',
  templateUrl: './choose-menus.page.html',
  styleUrls: ['./choose-menus.page.scss'],
  standalone: true,
  imports: [IonImg, IonFooter, IonCol, IonRow, IonGrid, IonIcon,  IonModal, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonList, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChooseMenusPage implements OnInit  {
  // IMPORTANTE - Sería interesante añadir el estado de la clase con el número 
  // de integrantes de cada una para así controlar cuando están completas y que 
  // no se pueda añadir más menús que alumnos.
  
  classes: Class[] = [];
  infoClasses: { [key: string]: {n:number, state:boolean }} = {};
  menuTypes: MenuType[] = [];
  selectedClass: Class | null = null;
  menu: Menu = {
    id: '',
    date: Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))),
    menus: {}
  };
  menuTypesPerPage: number = 2;
  currentMTPage: number = 0;
  classesPerPage: number = 4;
  currentCPage: number = 0;




  constructor(private classService: ClassService, 
              private menuService: MenuService,
              private arasaacService: ArasaacService) {}

  ngOnInit() {
    
    this.loadStructure();
  }


  loadStructure() {
    this.classService.getAllClasses().subscribe(classes => {
      this.classes = classes;
      this.menuService.getAllMenuTypes().subscribe(menuTypes => {
        this.menuTypes = menuTypes;
        this.classes.forEach(cls => {
          this.infoClasses[cls.name] = {n:0, state:false};
          this.menu.menus[cls.name] = {};
          this.menuTypes.forEach(menuType => {
            this.menu.menus[cls.name][menuType.name] = 0;
          });
        });
      });
    });
  }


  selectClass(cls: Class) {
    this.selectedClass = cls;
  }

  increment(menuTypeName: string) {
    if (this.selectedClass) {
      let totalMenus = Object.values(this.menu.menus[this.selectedClass.name]).reduce((a, b) => a + b, 0);
      if (totalMenus < this.infoClasses[this.selectedClass.name].n) {
        this.menu.menus[this.selectedClass.name][menuTypeName]++;
        this.updateClassState();
      } else {
        alert('No hay tantos alumnos.');
      }
    }
  }

  decrement(menuTypeName: string) {
    if (this.selectedClass && this.menu.menus[this.selectedClass.name][menuTypeName] > 0) {
      this.menu.menus[this.selectedClass.name][menuTypeName]--;
      this.updateClassState();
    }
  }

  incrementStudents() {
    if (this.selectClass && this.infoClasses[this.selectedClass.name].n < 30) {
      this.infoClasses[this.selectedClass.name].n++;
      this.updateClassState();
    }
  }

  decrementStudents() {
    if (this.selectedClass) {
      const totalMenus = Object.values(this.menu.menus[this.selectedClass.name]).reduce((a, b) => a + b, 0);
      if (this.infoClasses[this.selectedClass.name].n > totalMenus) {
        this.infoClasses[this.selectedClass.name].n--;
        this.updateClassState();
      } else {
        alert('No se puede decrementar, hay tantos menús como estudiantes.');
      }
    }
  }

  updateClassState(){
    const totalMenus = Object.values(this.menu.menus[this.selectedClass.name]).reduce((a, b) => a + b, 0);
    this.infoClasses[this.selectedClass.name].state = 
      (this.infoClasses[this.selectedClass.name].n != 0 
      && totalMenus == this.infoClasses[this.selectedClass.name].n);
  }
  
  showPendingMenus(cls: Class) {
    if (!this.infoClasses[cls.name].state){
      let pendingMenus = this.infoClasses[cls.name].n;
      this.menuTypes.forEach(menuType => {
        pendingMenus -= this.menu.menus[cls.name][menuType.name];
      });
      alert(`Quedan por asignar ${pendingMenus} menús a la clase ${cls.name}`);
    }
  }

  getMenuTypesForcurrentPage(): MenuType[] {
    const startIndex = this.currentMTPage * this.menuTypesPerPage;
    return this.menuTypes.slice(startIndex, startIndex + this.menuTypesPerPage);
  }

  nextMTPage() {
    if ((this.currentMTPage + 1) * this.menuTypesPerPage < this.menuTypes.length) {
      this.currentMTPage++;
    }
  }

  previousMTPage() {
    if (this.currentMTPage > 0) {
      this.currentMTPage--;
    }
  }

  getClassesForcurrentPage(): Class[] {
    const startIndex = this.currentCPage * this.classesPerPage;
    return this.classes.slice(startIndex, startIndex + this.classesPerPage);
  }

  nextCPage() {
    if ((this.currentCPage + 1) * this.classesPerPage < this.classes.length) {
      this.currentCPage++;
    }
  }

  previousCPage() {
    if (this.currentCPage > 0) {
      this.currentCPage--;
    }
  }


  allClassesCompleted(){
    return Object.values(this.infoClasses).every(info => info.state);
  }

  completeTask(){
    if (this.allClassesCompleted()){
      this.menuService.createMenu(this.menu).then(() => {
        alert('Menús guardados correctamente.');
      });
    } else {
      alert('No se pueden guardar los menús, hay clases sin completar.');
    }
  }

  getNumPict(num: number): string{
    // return this.arasaacService.getPictogramImageUrl(this.arasaacService.numbersPictograms[num]);
    return `../../../assets/imagenes/numbers/${num}.png`;
  }

  getPictogram(pictogramId:string): string{
    return this.arasaacService.getPictogramImageUrl(pictogramId);
  }
}