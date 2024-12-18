import { inject, Injectable } from '@angular/core';
import { TaskI } from '../models/task.models';
import { DescriptionI } from '../models/task.models';
import { collectionData, docData, Firestore} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, DocumentReference, getDoc, setDoc, query, Query, where, getDocs, DocumentData, updateDoc } from 'firebase/firestore';import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { Timestamp } from 'firebase/firestore';
@Injectable({
    providedIn: 'root'
})

export class TasksService{

  firestore: Firestore = inject(Firestore);

  constructor(private firestoreService: FirestoreService){}

    // Creamos un BehaviorSubject para las tareas actualizadas
  private updatedTaskSubject = new BehaviorSubject<any>(null);
  updatedTask$ = this.updatedTaskSubject.asObservable();
  
  // Inicializa un profesor con los campos a null menos el id
  initTask(): TaskI {
    const newTask: TaskI = {
        taskID: this.firestoreService.createIDDoc(),
        title: null,
        type: null,
        associatedDescriptionId: null,
        descriptionData: null,
        assigned: [] // Inicializamos como un array vacío
    };
    return newTask;
  }

  initTaskDescription(): DescriptionI{
    const newTaskDescription: DescriptionI = {
      descriptionId: null,
      imagesId: null,
      pictogramId: null,
      text: null,
      link: null
      };
    return newTaskDescription;
  }

  // Método para obtener una descripción por su descriptionId
  async getDescriptionById(descriptionId: string): Promise<any> {
    const results = await this.firestoreService.getCollection('Description', [
      { field: 'descriptionId', operator: '==', value: descriptionId },
    ]);
    return results.length > 0 ? results[0] : null; // Devuelve el primer resultado o null si no hay coincidencias
  }

  async actualizarTarea(tarea: TaskI, assignedId: string) {
    try {
      const tareaRef = doc(this.firestore, 'Tasks', tarea.taskID); // Referencia al documento
  
      // Crear una copia del array 'assigned' para evitar mutación directa
      const updatedAssigned = tarea.assigned.map(assignment => ({
        ...assignment
      }));
  
      // Buscar el índice del estudiante logueado en el array 'assigned' utilizando 'assignedId'
      const studentIndex = updatedAssigned.findIndex(assignment => assignment.assignedId === assignedId);
  
      if (studentIndex !== -1) {
        // Actualizamos el estado de 'completed' y 'doneTime' para el estudiante correspondiente
        updatedAssigned[studentIndex].completed = true;
        updatedAssigned[studentIndex].doneTime = Timestamp.now(); // Marca de tiempo actual
  
        console.log('Updated Assigned:', updatedAssigned);
  
        // Actualizamos el documento en Firestore con el nuevo array 'assigned'
        await updateDoc(tareaRef, {
          assigned: updatedAssigned
        });
  
        console.log('Tarea actualizada exitosamente en Firestore');
  
        // Emitir la tarea actualizada a los suscriptores
        this.updatedTaskSubject.next({
          ...tarea,
          assigned: updatedAssigned
        });
      } else {
        console.error('El estudiante no está asignado a esta tarea.');
      }
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  }    
}