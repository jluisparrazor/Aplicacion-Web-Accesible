import { inject, Injectable } from '@angular/core';
import { TaskI } from '../models/task.models';
import { collectionData, docData, Firestore} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, DocumentReference, getDoc, setDoc, query, Query, where, getDocs, DocumentData, updateDoc } from 'firebase/firestore';import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from './firestore.service';
@Injectable({
    providedIn: 'root'
})

export class TasksService{

  firestore: Firestore = inject(Firestore);

  constructor(private firestoreService: FirestoreService){}

    // Creamos un BehaviorSubject para las tareas actualizadas
    private updatedTaskSubject = new BehaviorSubject<any>(null);
  updatedTask$ = this.updatedTaskSubject.asObservable();

  // Método para obtener una descripción por su descriptionId
  async getDescriptionById(descriptionId: string): Promise<any> {
    const results = await this.firestoreService.getCollection('Description', [
      { field: 'descriptionId', operator: '==', value: descriptionId },
    ]);
    return results.length > 0 ? results[0] : null; // Devuelve el primer resultado o null si no hay coincidencias
  }

  // Método para actualizar la tarea en Firestore
  async actualizarTarea(tarea: TaskI) {
    try {
      const tareaRef = doc(this.firestore, 'Tasks', tarea.taskID); // Referencia al documento
      await updateDoc(tareaRef, {
        completed: tarea.completed
      });
      console.log('Tarea actualizada exitosamente');
      
      // Emitir la tarea actualizada a los suscriptores
      this.updatedTaskSubject.next(tarea);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  }
  
}