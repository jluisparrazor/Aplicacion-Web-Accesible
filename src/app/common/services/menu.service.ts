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

  // TIPOS DE MENÚ

  // Obtener todos los tipos de menú
  getMenuTypes(): Observable<MenuType[]> {
    const refCollection = collection(this.firestore, 'MenuTypes');
    return collectionData(refCollection, { idField: 'id' }) as Observable<MenuType[]>;
  }

  // Obtener un tipo de menú por ID
  getMenuTypeById(id: string): Promise<MenuType> {
    const document = doc(this.firestore, `MenuTypes/${id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
          throw new Error('Document(MenuType) does not exist - getMenuTypeById');
        }
        return { id, ...docSnapshot['data']() } as MenuType;
      });
  }
  
  // Crear un nuevo tipo de menú
  createMenuType(menuType: MenuType): Promise<void> {
    const id = uuidv4();
    const document = doc(this.firestore, `MenuTypes/${id}`);
    const { id: _, ...dataWithoutId } = menuType; // Excluir el campo id
    return setDoc(document, { ...dataWithoutId });
  }

  // Actualizar un tipo de menú
  updateMenuType(menuType: MenuType): Promise<void> {
    const document = doc(this.firestore, `MenuTypes/${menuType.id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(MenuType) does not exist - updateMenuType');
      }
      const { id: _, ...dataWithoutId } = menuType; // Excluir el campo id
      return updateDoc(document, { ...dataWithoutId });
    });
  }


  // Eliminar un tipo de menú
  deleteMenuType(id: string): Promise<void> {
    const document = doc(this.firestore, `MenuTypes/${id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(MenuType) does not exist - deleteMenuType');
      }
      return deleteDoc(document);
    });
  }
  

  // MENÚS

  // Obtener todos los menús
  getMenus(): Observable<Menu[]> {
    const refCollection = collection(this.firestore, 'Menus');
    return collectionData(refCollection, { idField: 'id' }) as Observable<Menu[]>;
  }

  // Obtener un tipo de menú por ID
  getMenuById(id: string): Promise<Menu> {
    const document = doc(this.firestore, `Menu/${id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
          throw new Error('Document(Menu) does not exist - getMenuById');
        }
        return { id, ...docSnapshot['data']() } as Menu;
      });
  }

  // Obtener un menú por fecha
  getMenuByDate(date: Date): Promise<Menu> {
    const document = doc(this.firestore, `Menus/${date.toISOString()}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
          throw new Error('Document(Menu) does not exist - getMenuByDate');
        }
        return { id: date.toISOString(), ...docSnapshot['data']() } as Menu;
      });
  }


  // Crear un nuevo menú
  createMenu(menu: Menu): Promise<void> {
    const id = uuidv4();
    const document = doc(this.firestore, `Menus/${id}`);
    const { id: _, ...dataWithoutId } = menu; // Excluir el campo id
    return setDoc(document, { ...dataWithoutId });
  }

  // Actualizar un menú
  updateMenu(menu: Menu): Promise<void> {
    const document = doc(this.firestore, `Menus/${menu.id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(Menu) does not exist - updateMenu');
      }
      const { id: _, ...dataWithoutId } = menu; // Excluir el campo id
      return updateDoc(document, { ...dataWithoutId });
    });
  }

  // Eliminar un menú
  deleteMenu(id: string): Promise<void> {
    const document = doc(this.firestore, `Menus/${id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(Menu) does not exist - deleteMenu');
      }
      return deleteDoc(document);
    });
  }
}