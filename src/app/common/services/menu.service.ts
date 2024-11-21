import { Injectable } from '@angular/core';
import { Menu, MenuType } from '../models/menu.models';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private firestore: FirestoreService) {}

  // Crear un nuevo menú
  async createMenu(newMenu: Menu): Promise<string> {
    newMenu.id = this.firestore.createIDDoc();
    await this.firestore.createDocumentID(newMenu, 'Menus', newMenu.id);
    return newMenu.id;
  }

  // Obtener un menú por ID
  async getMenuById(id: string): Promise<Menu | null> {
    const doc = await this.firestore.getDocument<Menu>(`Menus/${id}`);
    if (doc.exists())
      return doc.data() as Menu ;
    else {
      console.log('Document does not exist - getMenuById');
      return null;
    }
  }

  // Actualizar un menú
  async updateMenu(updatedMenu: Menu): Promise<boolean> {
    const doc = await this.firestore.getDocument<Menu>(`Menus/${updatedMenu.id}`);
    if (doc.exists()) {
      await this.firestore.createDocumentID(updatedMenu, 'Menus', updatedMenu.id);
      return true;
    } else
      return false;
  }

  // Eliminar un menú
  async deleteMenu(id: string): Promise<boolean> {
    const doc = await this.firestore.getDocument<Menu>(`Menus/${id}`);
    if (doc.exists()) {
      await this.firestore.deleteDocumentID('Menus', id);
      return true;
    } else
      return false;
  }

  // Obtener todos los menús
  getAllMenus(): Observable<Menu[]> | null {
    const refCollection = this.firestore.getCollectionChanges('Menus');
    if (!refCollection) {
      console.log('No menus found');
      return null;
    } else
      return refCollection as Observable<Menu[]>;
  }

  // Crear un nuevo tipo de menú
  async createMenuType(newMenuType: MenuType): Promise<string> {
    newMenuType.id = this.firestore.createIDDoc();
    await this.firestore.createDocumentID(newMenuType, 'MenuTypes', newMenuType.id);
    return newMenuType.id;
  }

  // Obtener un tipo de menú por ID
  async getMenuTypeById(id: string): Promise<MenuType | null> {
    const doc = await this.firestore.getDocument<MenuType>(`MenuTypes/${id}`);
    if (doc.exists())
      return doc.data() as MenuType;
    else {
      console.log('Document does not exist - getMenuTypeById');
      return null;
    }
  }

  // Actualizar un tipo de menú
  async updateMenuType(updatedMenuType: MenuType): Promise<boolean> {
    const doc = await this.firestore.getDocument<MenuType>(`MenuTypes/${updatedMenuType.id}`);
    if (doc.exists()) {
      await this.firestore.createDocumentID(updatedMenuType, 'MenuTypes', updatedMenuType.id);
      return true;
    } else
      return false;
  }

  // Eliminar un tipo de menú
  async deleteMenuType(id: string): Promise<boolean> {
    const doc = await this.firestore.getDocument<MenuType>(`MenuTypes/${id}`);
    if (doc.exists()) {
      await this.firestore.deleteDocumentID('MenuTypes', id);
      return true;
    } else
      return false;
  }

  // Obtener todos los tipos de menú
  getAllMenuTypes(): Observable<MenuType[]> | null {
    const refCollection = this.firestore.getCollectionChanges('MenuTypes');
    if (!refCollection) {
      console.log('No menu types found');
      return null;
    } else
      return refCollection as Observable<MenuType[]>;
  }
}