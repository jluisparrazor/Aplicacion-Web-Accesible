import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonModal, IonButtons, IonIcon, IonGrid, IonRow, IonCol, IonFooter, IonImg } from '@ionic/angular/standalone';
import { Class } from '../../../common/models/class.models'; 
import { MenuType, Menu } from '../../../common/models/menu.models'; 
import { isStudent } from 'src/app/common/models/student.models';
import { Timestamp } from 'firebase/firestore';
import { ClassService } from '../../../common/services/class.service';
import { MenuService } from '../../../common/services/menu.service';
import { ArasaacService } from 'src/app/common/services/arasaac.service';
import { SessionService } from 'src/app/common/services/session.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-task-menus',
  templateUrl: './task-menus.page.html',
  styleUrls: ['./task-menus.page.scss'],
  standalone: true,
  imports: [IonImg, IonFooter, IonCol, IonRow, IonGrid, IonIcon,  IonModal, IonCardTitle, IonCardContent, IonCard, IonList, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TaskMenusPage implements OnInit  {  
  classes: Class[] = [];
  infoClasses: { [key: string]: {n:number, state:boolean }} = {};
  menuTypes: MenuType[] = [];
  selectedClass: Class | null = null;
  menu: Menu = {
    id: '',
    date: Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))),
    menus: {}
  };
  menuTypesPerPage: number = 1;
  currentMTPage: number = 0;
  classesPerPage: number = 4;
  currentCPage: number = 0;

  readonly cardsHeight: number = 150;


  constructor(private classService: ClassService,
              private menuService: MenuService, 
              private arasaacService: ArasaacService,
              private router: Router,
              private sessionService: SessionService) {}

  ngOnInit() {
    if (!isStudent(this.sessionService.getCurrentUser())) {
      this.router.navigate(['/paginaprincipal']);
    }
    this.loadStructure();
    this.calculateNumClassesPerPage();
    // this.calculateNumMenuTypesPerPage();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.calculateNumClassesPerPage();
    //this.calculateNumMenuTypesPerPage();
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

  calculateNumClassesPerPage() {
    const headerHeight = 80;
    const footerHeight = 80;
    const contentHeight = window.innerHeight - headerHeight - footerHeight - 20;

    console.log('window.innerHeight', window.innerHeight, ' headerHeight', headerHeight, ' footerHeight', footerHeight);

    this.classesPerPage = Math.floor(contentHeight / this.cardsHeight);
  }

  calculateNumMenuTypesPerPage() {
    const headerHeight = 150;
    const footerHeight = 80;
    const contentHeight = window.innerHeight - headerHeight - footerHeight;

    console.log('window.innerHeight', window.innerHeight, ' headerHeight', headerHeight, ' footerHeight', footerHeight);

    this.menuTypesPerPage = Math.floor(contentHeight / this.cardsHeight);
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
        // alert('No hay tantos alumnos.');
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
        // alert('No se puede decrementar, hay tantos menús como estudiantes.');
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
      if (pendingMenus == 0) {
        // alert("No hay alumnos en la clase.");
      }
      else {
          this.menuTypes.forEach(menuType => {
          pendingMenus -= this.menu.menus[cls.name][menuType.name];
        });
        // alert(`Quedan por asignar ${pendingMenus} menús a la clase ${cls.name}`);
      }
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


  getNumPict(num: number): string{
    // return this.arasaacService.getPictogramImageUrl(this.arasaacService.numbersPictograms[num]);
    return `../../../assets/imagenes/numbers/${num}.png`;
  }

  getPictogram(pictogramId:string): string{
    return `https://api.arasaac.org/api/pictograms/${pictogramId}`;
  }  
  
  completeTask(){
    if (this.allClassesCompleted()){
      this.menuService.createMenu(this.menu).then(() => {
        // alert('Menús guardados correctamente.');
      });
    } else {
      // alert('No se pueden guardar los menús, hay clases sin completar.');
    }
  }

  salir(){
    this.router.navigate(['/tareasdiarioalumno']);
  }

}