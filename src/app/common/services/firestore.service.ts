import { inject, Injectable } from '@angular/core';
import { TareaI } from '../models/tarea.models';
import { collectionData, docData, Firestore} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, DocumentReference, getDoc, setDoc, query, where, getDocs } from 'firebase/firestore';import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  firestore: Firestore = inject(Firestore);
  constructor() { }

  // Read
  getDocument<tipo>(path: string){
    const document= doc(this.firestore, path) as DocumentReference<tipo, any>;
    return getDoc<tipo, any>(document);
  }

  getCollectionChanges<tipo>(path: string){
    const refCollecion= collection(this.firestore, path);
    return collectionData(refCollecion) as Observable<tipo[]>;
  }

  getDocumentChanges<tipo>(path: string){
    console.log('getDocumentChanges -> ', path);
    const document= doc(this.firestore, path);
    return docData(document) as Observable<tipo[]>;
  }

  //Create 
  createDocument(data: any, path: string){
    const document= doc(this.firestore, path);
    return setDoc(document, data);
  }

  createDocumentID(data: any, path: string, idDoc: string){
    const document= doc(this.firestore, `${path}/${idDoc}`); //Mandamos path concatenado con el idDoc
    return setDoc(document, data);
  }
  createIDDoc(){
    return uuidv4();
  }

  //Delete
  deleteDocumentID(path: string, idDoc: string){
    const document= doc(this.firestore, `${path}/${idDoc}`);
    console.log("Se va a eliminar el ID: " + idDoc);
    return deleteDoc(document);
  }
  
  // Obtener ID de un documento por un campo específico 
  async getDocumentIDByField(collectionName: string, fieldName: string, value: any): Promise<string | null> { 
    const colRef = collection(this.firestore, collectionName); 
    const q = query(colRef, where(fieldName, '==', value)); 
    const querySnapshot = await getDocs(q); 
    if (querySnapshot.empty) { 
      return null; 
    } else { 
      return querySnapshot.docs[0].id; 
    } 
  }

  // Obtener todos los documentos de una colección
  async getCollection(collectionName: string): Promise<any[]> {
    const colRef = collection(this.firestore, collectionName);
    const querySnapshot = await getDocs(colRef);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  // Obtener tareas por usuario
  async getTareasPorUsuario(usuarioId: string): Promise<TareaI[]> {
    const tareasRef = collection(this.firestore, '/Tareas');
    const usuarioRef = doc(this.firestore, `/Usuarios/${usuarioId}`);
    const usuarioDoc = await getDoc(usuarioRef);
    
    if (!usuarioDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }

    const usuarioNombre = usuarioDoc.data()?.['nombre'];

    const q = query(tareasRef, where('Asignado', '==', usuarioNombre)); // Ahora comparamos con la referencia del usuario
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TareaI[];
  }
  
}
