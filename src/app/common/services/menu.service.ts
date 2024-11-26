import { Injectable } from '@angular/core';
import { Menu, MenuType } from '../models/menu.models';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private firestore: Firestore) {}

  // Crear un nuevo menú
  async createMenu(newMenu: Menu): Promise<string> {
    newMenu.id = uuidv4();
    const document = doc(this.firestore, `Menus/${newMenu.id}`);
    try {
      await setDoc(document, newMenu);
      return newMenu.id;
    } catch (error) {
      console.error('Error creating document - createMenu: ', error);
      return '';
    }
  }

  // Obtener un menú por ID
  async getMenuById(id: string): Promise<Menu | null> {
    const document = doc(this.firestore, `Menus/${id}`);
    const result = await getDoc(document);
    if (result.exists())
      return result.data() as Menu;
    else {
      console.log('Document does not exist - getMenuById');
      return null;
    }
  }

  // Actualizar un menú
  async updateMenu(updatedMenu: Menu): Promise<boolean> {
    const document = doc(this.firestore, `Menus/${updatedMenu.id}`);
    const result = await getDoc(document);
    if (result.exists()) {
      try {
        await setDoc(document, updatedMenu);
        return true;
      } catch (error) {
        console.error('Error updating document - updateMenu: ', error);
        return false;
      }
    } else {
      console.log('Document does not exist - updateMenu');
      return false;
    }
  }

  // Eliminar un menú
  async deleteMenu(id: string): Promise<boolean> {
    const document = doc(this.firestore, `Menus/${id}`);
    const result = await getDoc(document);
    if (result.exists()) {
      try {
        await deleteDoc(document);
        return true;
      } catch (error) {
        console.error('Error deleting document - deleteMenu: ', error);
        return false;
      }
    } else {
      console.log('Document does not exist - deleteMenu');
      return false;
    }
  }

  // Obtener todos los menús
  getAllMenus(): Observable<Menu[]> | null {
    const collec = collection(this.firestore, 'Menus');
    const refCollection = collectionData(collec) as Observable<Menu[]>;
    if (!refCollection) {
      console.log('No menus found');
      return null;
    } else
      return refCollection;
  }

  // Crear un nuevo tipo de menú
  async createMenuType(newMenuType: MenuType): Promise<string> {
    newMenuType.id = uuidv4();
    const document = doc(this.firestore, `MenuTypes/${newMenuType.id}`);
    try {
      await setDoc(document, newMenuType);
      return newMenuType.id;
    } catch (error) {
      console.error('Error creating document - createMenuType: ', error);
      return '';
    }
  }

  // Obtener un tipo de menú por ID
  async getMenuTypeById(id: string): Promise<MenuType | null> {
    const document = doc(this.firestore, `MenuTypes/${id}`);
    const result = await getDoc(document);
    if (result.exists())
      return result.data() as MenuType;
    else {
      console.log('Document does not exist - getMenuTypeById');
      return null;
    }
  }

  // Actualizar un tipo de menú
  async updateMenuType(updatedMenuType: MenuType): Promise<boolean> {
    const document = doc(this.firestore, `MenuTypes/${updatedMenuType.id}`);
    const result = await getDoc(document);
    if (result.exists()) {
      try {
        await setDoc(document, updatedMenuType);
        return true;
      } catch (error) {
        console.error('Error updating document - updateMenuType: ', error);
        return false;
      }
    } else {
      console.log('Document does not exist - updateMenuType');
      return false;
    }
  }

  // Eliminar un tipo de menú
  async deleteMenuType(id: string): Promise<boolean> {
    const document = doc(this.firestore, `MenuTypes/${id}`);
    const result = await getDoc(document);
    if (result.exists()) {
      try {
        await deleteDoc(document);
        return true;
      } catch (error) {
        console.error('Error deleting document - deleteMenuType: ', error);
        return false;
      }
    } else {
      console.log('Document does not exist - deleteMenuType');
      return false;
    }
  }

  // Obtener todos los tipos de menú
  getAllMenuTypes(): Observable<MenuType[]> | null {
    const collec = collection(this.firestore, 'MenuTypes');
    const refCollection = collectionData(collec) as Observable<MenuType[]>;
    if (!refCollection) {
      console.log('No menu types found');
      return null;
    } else
      return refCollection;
  }
}