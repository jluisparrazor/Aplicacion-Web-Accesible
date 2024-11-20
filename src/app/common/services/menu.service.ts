import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, doc, setDoc, deleteDoc, updateDoc, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Menu, MenuType } from '../models/menu.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  constructor(private firestore: Firestore) {}

  // Obtener todos los tipos de menú
  getMenuTypes(): Observable<MenuType[]> {
    const refCollection = collection(this.firestore, 'menuTypes');
    return collectionData(refCollection, { idField: 'id' }) as Observable<MenuType[]>;
  }

  // Obtener todos los menús
  getMenus(): Observable<Menu[]> {
    const refCollection = collection(this.firestore, 'menus');
    return collectionData(refCollection, { idField: 'id' }) as Observable<Menu[]>;
  }

  // Crear un nuevo tipo de menú
  createMenuType(menuType: MenuType): Promise<void> {
    const id = uuidv4();
    const document = doc(this.firestore, `menuTypes/${id}`);
    return setDoc(document, { ...menuType, id });
  }

  // Crear un nuevo menú
  createMenu(menu: Menu): Promise<void> {
    const id = uuidv4();
    const document = doc(this.firestore, `menus/${id}`);
    return setDoc(document, { ...menu, id });
  }

  // Actualizar un tipo de menú
  updateMenuType(menuType: MenuType): Promise<void> {
    const document = doc(this.firestore, `menuTypes/${menuType.id}`);
    return updateDoc(document, { ...menuType });
  }

  // Actualizar un menú
  updateMenu(menu: Menu): Promise<void> {
    const document = doc(this.firestore, `menus/${menu.id}`);
    return updateDoc(document, { ...menu });
  }

  // Eliminar un tipo de menú
  deleteMenuType(id: string): Promise<void> {
    const document = doc(this.firestore, `menuTypes/${id}`);
    return deleteDoc(document);
  }

  // Eliminar un menú
  deleteMenu(id: string): Promise<void> {
    const document = doc(this.firestore, `menus/${id}`);
    return deleteDoc(document);
  }
}