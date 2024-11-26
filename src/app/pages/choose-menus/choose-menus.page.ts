import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonList, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonModal, IonButtons, IonIcon } from '@ionic/angular/standalone';
import { Class } from '../../common/models/class.models'; 
import { MenuType, Menu } from '../../common/models/menu.models'; 
import { Timestamp } from 'firebase/firestore';
import { ClassService } from '../../common/services/class.service';
import { MenuService } from '../../common/services/menu.service';


@Component({
  selector: 'app-choose-menus',
  templateUrl: './choose-menus.page.html',
  styleUrls: ['./choose-menus.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButtons,  IonModal, IonCardTitle, IonCardHeader, IonCardContent, IonCard, IonList, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChooseMenusPage implements OnInit  {
  // IMPORTANTE - Sería interesante añadir el estado de la clase con el número 
  // de integrantes de cada una para así controlar cuando están completas y que 
  // no se pueda añadir más menús que alumnos.
  
  classes: Class[] = [];
  menuTypes: MenuType[] = [];
  selectedClass: Class | null = null;
  menu: Menu = {
    id: '',
    date: Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))),
    menus: {}
  };

  constructor(private classService: ClassService, 
              private menuService: MenuService) {}

  ngOnInit() {
    
    this.loadStructure();
  }

  convertMenuToJson() {
    return JSON.stringify(this.menu, null, 2);
  }

  loadStructure() {
    this.classService.getAllClasses().subscribe(classes => {
      this.classes = classes;
      this.menuService.getAllMenuTypes().subscribe(menuTypes => {
        this.menuTypes = menuTypes;
        this.classes.forEach(cls => {
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
      this.menu.menus[this.selectedClass.name][menuTypeName]++;
    }
  }

  decrement(menuTypeName: string) {
    if (this.selectedClass && this.menu.menus[this.selectedClass.name][menuTypeName] > 0) {
      this.menu.menus[this.selectedClass.name][menuTypeName]--;
    }
  }
}