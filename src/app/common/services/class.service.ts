import { Injectable } from '@angular/core';
import { Class } from '../models/class.models';
import { Firestore, collectionData } from '@angular/fire/firestore';
import { collection, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private firestore: Firestore) {}

  // Crear una nueva clase
  async createClass(newClass: Class): Promise<string>{
    newClass.id  = uuidv4() ;
    const document = doc(this.firestore, `Classes/${newClass.id}`);
    try {
      await setDoc(document, newClass);
      return newClass.id;
    } catch (error) {
      console.error('Error creating document - createClass: ', error);
      return '';
    }
  }

  // Obtener una clase por ID
  async getClassById(id: string) : Promise<Class | null> {
    const document = doc(this.firestore, `Classes/${id}`);
    const result = await getDoc(document);
    if (result.exists())
      return result.data() as Class ;
    else {
      console.log('Document does not exist - getClassById');
      // throw new Error('Document does not exist - getClassById');
      return null;
    }
  }

  // Actualizar una clase
  async updateClass(updatedClass: Class): Promise<boolean> {
    const document = doc(this.firestore, `Classes/${updatedClass.id}`);
    const result = await getDoc(document);
    if (result.exists()) {
      try {
        await setDoc(document, updatedClass);
        return true;
      } catch (error) {
        console.error('Error updating document - updateClass: ', error);
        return false;
      }
    } else {
      console.log('Document does not exist - updateClass');
      // throw new Error('Document does not exist - updateClass');
      return false;
    }
  }

  
  // Eliminar una clase
  async deleteClass(id: string): Promise<boolean> {
    const document = doc(this.firestore, `Classes/${id}`);
    const result = await getDoc(document);
    if (result.exists()) {
      try {
        await deleteDoc(document);
        return true;
      } catch (error) {
        console.error('Error updating document - updateClass: ', error);
        return false;
      }
    } else {
      console.log('Document does not exist - deleteClass');
      return false;
    }
  }

  // Obtener todas las clases
  getAllClasses(): Observable<Class[]> | null {
    const collec = collection(this.firestore, 'Classes');
    const refCollection = collectionData(collec) as Observable<Class[]>;
    if (!refCollection) {
      console.log('No classes found');
      return null;
    } else 
      return refCollection;
  }
}
