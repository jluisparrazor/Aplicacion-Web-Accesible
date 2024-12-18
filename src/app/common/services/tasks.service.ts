import { inject, Injectable } from '@angular/core';
import { StepI, TaskI } from '../models/task.models';
import { DescriptionI } from '../models/task.models';
import { collectionData, docData, Firestore} from '@angular/fire/firestore';
import { collection, deleteDoc, doc, DocumentReference, getDoc, setDoc, query, Query, where, getDocs, DocumentData, updateDoc } from 'firebase/firestore';import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
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
  initTask(): TaskI{
    const newTask: TaskI = {
      taskID: this.firestoreService.createIDDoc(),
      title: null,
      startTime: null,
      endTime: null,
      doneTime: null,
      type: null,
      completed: null,
      assigned: null,
      associatedDescriptionId: null,
      descriptionData: null
      };
    return newTask;
  }

  initTaskDescription(): DescriptionI{
    const newTaskDescription: DescriptionI = {
      descriptionId: null,
      imagesId: null,
      pictogramId: null,
      text: null,
      link: null,
      steps: null
      };
    return newTaskDescription;
  }

  initStep(): StepI {
    const newStep: StepI = {
      text: null,
      pictogramId: null,
      imageUrl: null,
      videoUrl: null
    }
    return newStep;
  }

  // Método para obtener una descripción por su descriptionId
  async getDescriptionById(descriptionId: string): Promise<any> {
    const results = await this.firestoreService.getCollection('Description', [
      { field: 'descriptionId', operator: '==', value: descriptionId },
    ]);
    return results.length > 0 ? results[0] : null; // Devuelve el primer resultado o null si no hay coincidencias
  }

  async actualizarTarea(tarea: TaskI, studentIndex: number) {
    try {
      const tareaRef = doc(this.firestore, 'Tasks', tarea.taskID); // Referencia al documento
  
      // Crear copias de los arrays para evitar mutación directa
      const updatedCompleted = [...tarea.completed];
      const updatedDoneTime = [...(tarea.doneTime || [])]; // Asegurarnos de que doneTime no sea undefined
    
      // Actualizamos el estado de la tarea completada y el timestamp para el estudiante
      updatedCompleted[studentIndex] = true;
      updatedDoneTime[studentIndex] = Timestamp.now(); // Marca de tiempo actual (o usar Timestamp.now() si prefieres Firestore)
  
      console.log('Updated Completed:', updatedCompleted);
      console.log('Updated DoneTime:', updatedDoneTime);
  
      // Actualizamos el documento en Firestore con ambos campos
      await updateDoc(tareaRef, {
        completed: updatedCompleted,
        doneTime: updatedDoneTime
      });
  
      console.log('Tarea actualizada exitosamente en Firestore');
  
      // Emitir la tarea actualizada a los suscriptores
      this.updatedTaskSubject.next({
        ...tarea,
        completed: updatedCompleted,
        doneTime: updatedDoneTime
      });
    } catch (error) {
      console.error('Error actualizando tarea:', error);
    }
  }
  
  
}