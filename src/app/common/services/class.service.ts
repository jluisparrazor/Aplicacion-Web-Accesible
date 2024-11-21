import { Injectable } from '@angular/core';
import { Class } from '../models/class.models';
import { FirestoreService } from '../services/firestore.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private firestore: FirestoreService) {}

  // Crear una nueva clase
  async createClass(newClass: Class): Promise<string>{
    newClass.id  = this.firestore.createIDDoc() ;
    await this.firestore.createDocumentID(newClass, 'Classes', newClass.id);
    return newClass.id;
  }

  // Obtener una clase por ID
  async getClassById(id: string) : Promise<Class | null> {
    const doc = await this.firestore.getDocument<Class>(`Classes/${id}`);
    if (doc.exists())
      return doc.data() as Class ;
    else {
      console.log('Document does not exist - getClassById');
      return null;
    }
  }

  // Actualizar una clase
  async updateClass(updatedClass: Class): Promise<boolean> {
    const doc = await this.firestore.getDocument<Class>(`Classes/${updatedClass.id}`);
    if (doc.exists()) {
      await this.firestore.createDocumentID(updatedClass, 'Classes', updatedClass.id);
      return true;
    } else
      return false;
  }

  // Eliminar una clase
  async deleteClass(id: string): Promise<boolean> {
    const doc = await this.firestore.getDocument<Class>(`Classes/${id}`);
    if (doc.exists()){
      await this.firestore.deleteDocumentID('Classes', id);
      return true;
    } else
      return false;
  }


  // Obtener todas las clases
  getAllClasses(): Observable<Class[]> | null {
    let classes: Class[];
    const refCollection = this.firestore.getCollectionChanges('Classes');
    if (!refCollection) {
      console.log('No classes found');
      return null;
    } else 
      return refCollection as Observable<Class[]>;
    
  }
}
