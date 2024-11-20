import { Injectable } from '@angular/core';
import { Firestore, collectionData, docData, doc, setDoc, deleteDoc, updateDoc, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Class } from '../models/class.models';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  constructor(private firestore: Firestore) {}

  // Crear una nueva clase
  createClass(newClass: Class): Promise<void> {
    const id = uuidv4();
    const document = doc(this.firestore, `Classes/${id}`);
    const { id: _, ...dataWithoutId } = newClass; // Excluir el campo id
    return setDoc(document, { ...dataWithoutId });
  }

  // Obtener una clase por ID
  getClassById(id: string): Promise<Class> {
    const document = doc(this.firestore, `Classes/${id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(Class) does not exist - getClassById');
      }
      return { id, ...docSnapshot['data']() } as Class;
    });
  }

  // Actualizar una clase
  updateClass(updatedClass: Class): Promise<void> {
    const document = doc(this.firestore, `Classes/${updatedClass.id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(Class) does not exist - updateClass');
      }
      const { id: _, ...dataWithoutId } = updatedClass; // Excluir el campo id
      return updateDoc(document, { ...dataWithoutId });
    });
  }

  // Eliminar una clase
  deleteClass(id: string): Promise<void> {
    const document = doc(this.firestore, `Classes/${id}`);
    return docData(document).toPromise().then(docSnapshot => {
      if (!docSnapshot['exists']()) {
        throw new Error('Document(Class) does not exist - deleteClass');
      }
      return deleteDoc(document);
    });
  }

  // Obtener todas las clases
  getAllClasses(): Observable<Class[]> {
    const refCollection = collection(this.firestore, 'Classes');
    return collectionData(refCollection, { idField: 'id' }) as Observable<Class[]>;
  }
}
