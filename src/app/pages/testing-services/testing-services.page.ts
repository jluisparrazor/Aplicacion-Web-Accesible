import { Component } from '@angular/core';
import { ClassService } from '../../common/services/class.service';
import { Class } from '../../common/models/class.models';
import { MenuService } from 'src/app/common/services/menu.service';
import { Menu, MenuType } from '../../common/models/menu.models';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonCard, IonCardTitle, IonCardHeader, IonCardContent } from '@ionic/angular/standalone';
import { Timestamp } from '@angular/fire/firestore';

@Component({
  selector: 'app-testing-services',
  templateUrl: './testing-services.page.html',
  styleUrls: ['./testing-services.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardHeader, IonCardTitle, IonCard,  IonButton, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class TestingServices {
  result: any;

  constructor(private classService: ClassService, private menuService: MenuService) {}

  async testClassService() {
    try {
      // Crear una nueva clase
      const newClass: Class = { id: '', name: 'Test Class', pictogramId: 'TestPictogramId' };
      const newClassId = await this.classService.createClass(newClass);
      console.log('Class created with ID:', newClassId);
      console.log('Prueba');

      // Obtener la clase por ID
      const fetchedClass = await this.classService.getClassById(newClassId);
      console.log('Fetched Class:', fetchedClass);

      // Actualizar la clase
      fetchedClass.name = 'Updated Test Class';
      await this.classService.updateClass(fetchedClass);
      console.log('Class updated');

      // Obtener todas las clases
      const allClasses = this.classService.getAllClasses();
      console.log('All Classes:', allClasses);

      // Eliminar la clase
      await this.classService.deleteClass(newClassId);
      console.log('Class deleted');

      // Actualizar el resultado en la vista
      this.result = {
        createdClassId: newClassId,
        fetchedClass,
        allClasses,
      };
      
    } catch (error) {
      console.error('Error testing ClassService:', error);
      this.result = { error: (error as Error).message };
    }
  }
async testMenuService() {
  try {
    // Crear un nuevo menú
    const newMenu: Menu = {
      id: '',
      date: Timestamp.now(),
      menus: {
      'Class1': {
        'MenuType1': 1,
        'MenuType2': 2
      },
      'Class2': {
        'MenuType1': 3,
        'MenuType3': 4
      }
      }
    };
    const newMenuId = await this.menuService.createMenu(newMenu);
    console.log('Menu created with ID:', newMenuId);

    // Obtener el menú por ID
    const fetchedMenu = await this.menuService.getMenuById(newMenuId);
    console.log('Fetched Menu:', fetchedMenu);

    // Actualizar el menú
    fetchedMenu.date = Timestamp.now();
    await this.menuService.updateMenu(fetchedMenu);
    console.log('Menu updated');

    // Obtener todos los menús
    const allMenus = this.menuService.getAllMenus();
    console.log('All Menus:', allMenus);

    // Eliminar el menú
    await this.menuService.deleteMenu(newMenuId);
    console.log('Menu deleted');

    // Actualizar el resultado en la vista
    this.result = {
      createdMenuId: newMenuId,
      fetchedMenu,
      allMenus,
    };
    
  } catch (error) {
    console.error('Error testing MenuService:', error);
    this.result = { error: (error as Error).message };
  }
}

async testMenuTypeService() {
  try {
    // Crear un nuevo tipo de menú
    const newMenuType : MenuType = { id: '', name: 'Test MenuType', pictogramId: 'TestPictogramId', visible: true };
    const newMenuTypeId = await this.menuService.createMenuType(newMenuType);
    console.log('MenuType created with ID:', newMenuTypeId);

    // Obtener el tipo de menú por ID
    const fetchedMenuType = await this.menuService.getMenuTypeById(newMenuTypeId);
    console.log('Fetched MenuType:', fetchedMenuType);

    // Actualizar el tipo de menú
    fetchedMenuType.name = 'Updated Test MenuType';
    await this.menuService.updateMenuType(fetchedMenuType);
    console.log('MenuType updated');

    // Obtener todos los tipos de menú
    const allMenuTypes = this.menuService.getAllMenuTypes();
    console.log('All MenuTypes:', allMenuTypes);

    // Eliminar el tipo de menú
    await this.menuService.deleteMenuType(newMenuTypeId);
    console.log('MenuType deleted');

    // Actualizar el resultado en la vista
    this.result = {
      createdMenuTypeId: newMenuTypeId,
      fetchedMenuType,
      allMenuTypes,
    };
    
  } catch (error) {
    console.error('Error testing MenuTypeService:', error);
    this.result = { error: (error as Error).message };
  }
}
}