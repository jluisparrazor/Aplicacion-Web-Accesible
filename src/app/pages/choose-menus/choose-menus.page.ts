import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonList, IonLabel } from '@ionic/angular/standalone';
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
  imports: [IonLabel, IonList, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class ChooseMenusPage implements OnInit  {
  classes: Class[] = [];
  selectedClass: Class | null = null;
  menuTypes: MenuType[] = [];
  menu: Menu = {
    id: '',
    date: Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0))),
    menus: {}
  };

  constructor(private classService: ClassService, private menuService: MenuService) {}

  ngOnInit() {/*
    const classSubscription = this.classService.getAllClasses().subscribe(classes => {
      this.classes = classes;
    });
    classSubscription.unsubscribe();

    const menuTypeSubscription = this.menuService.getMenuTypes().subscribe(menuTypes => {
      this.menuTypes = menuTypes;
    });
    menuTypeSubscription.unsubscribe();

    this.classes.forEach(cls => {
      this.menu.menus[cls.name] = {};
      this.menuTypes.forEach(menuType => {
        this.menu.menus[cls.name][menuType.name] = 0;
      });
    });*/
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