import { inject, Injectable } from '@angular/core';
import { TaskI } from '../models/task.models';
import { StudentI } from '../models/student.models';
import { collectionData, docData, Firestore} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, DocumentReference, getDoc, setDoc, query, Query, where, getDocs, DocumentData, updateDoc } from 'firebase/firestore';import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
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

  getDocumentReference(collection: string, docId: string){
    const docRef = doc(this.firestore, collection, docId);
    return docRef;
  }

  // Método en firestoreService para obtener un estudiante por su nombre completo
  async getStudentByName(studentName: string): Promise<StudentI | null> {
    try {
      // Filtro para buscar al estudiante por su nombre completo
      const filters = [
        { field: 'fullName', operator: '==', value: studentName }  // Asegúrate de usar el nombre correcto del campo en Firestore
      ];
  
      // Llamamos al método getCollection con el filtro
      const students = await this.getCollection('students', filters);  // 'students' es el nombre de la colección
  
      if (students.length > 0) {
        return students[0];  // Asumimos que hay solo un estudiante con ese nombre
      } else {
        console.log(`No se encontró el estudiante con el nombre: ${studentName}`);
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el estudiante:', error);
      return null;
    }
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

  async updateDocument(ref: DocumentReference, data: any): Promise<void> {
    return await updateDoc(ref, data);
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

  async getCollection(collectionName: string, filters?: { field: string; operator: any; value: any }[]): Promise<any[]> {
    const colRef = collection(this.firestore, collectionName); // Referencia a la colección
    let q: Query<DocumentData> = colRef; // Declaramos `q` como Query explícitamente
  
    // Si hay filtros, los aplicamos
    if (filters) {
      for (const filter of filters) {
        q = query(q, where(filter.field, filter.operator, filter.value));
      }
    }
  
    // Ejecutamos la consulta y devolvemos los documentos
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async getTareasPorUsuario(usuarioId: string): Promise<TaskI[]> {
    const tareasRef = collection(this.firestore, '/Tasks');
    const usuarioRef = doc(this.firestore, `/Students/${usuarioId}`);
    const usuarioDoc = await getDoc(usuarioRef);
    
    if (!usuarioDoc.exists()) {
      throw new Error('Usuario no encontrado');
    }
  
    // Recuperar el nombre del usuario desde el documento
    const usuarioNombre = usuarioDoc.data()?.['name'];
    console.log('Nombre del usuario:', usuarioNombre);
  
    // Consultar tareas donde el campo 'assigned' contiene un objeto con 'assignedName' igual al nombre del usuario
    const q = query(tareasRef);
    const snapshot = await getDocs(q);

    const tareasUsuario = snapshot.docs
      .map((doc) => {
        const tareaData = doc.data();
        return {
          taskID: doc.id,
          ...tareaData,
          assigned: (tareaData['assigned'] || []).map((assigned: any) => ({
            assignedName: assigned.assignedName || null,
            assignedId: assigned.assignedId || null,
            completed: assigned.completed || false,
            doneTime: assigned.doneTime || null,
            startTime: assigned.startTime || null,
            endTime: assigned.endTime || null,
          })),
        } as TaskI;
      })
      .filter((tarea) =>
        tarea.assigned.some((assigned) => assigned.assignedId === usuarioId)
      );
  
      if (tareasUsuario.length === 0) {
        console.log('No se encontraron tareas asignadas al usuario:', usuarioNombre);
      } 
      return tareasUsuario;
  }
}

