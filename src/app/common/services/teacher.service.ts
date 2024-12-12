import { Injectable } from "@angular/core";
import { TeacherI } from "../models/teacher.models";
import { FirestoreService } from "./firestore.service";

@Injectable({
    providedIn: 'root' // or a specific module
  })
// Clase que se encarga de la lógica de los profesores
export class TeacherService{
    constructor(private readonly firestoreService: FirestoreService) {}

    // Inicializa un profesor con los campos a null menos el id
    initTeacher(): TeacherI{
        const newTeacher: TeacherI = {
            id: this.firestoreService.createIDDoc(),
            name: null,
            surname: null,
            password: null,
            dni:null,
            administrative: false,
            pictogramId: null,
            email: null,
            birthdate: null,
            phone: null,
          };
    return newTeacher;
   }

    // Obtiene todos los profesores de la base de datos
    loadTeachers(): Promise<TeacherI[]> {
        return new Promise((resolve) => {
            this.firestoreService.getCollectionChanges<TeacherI>('Teachers').subscribe((data) => {
                if (data) {
                    console.log('Profesores cargados con éxito');
                    resolve(data);
                } else {
                    console.log('No hay profesores en la base de datos');
                    resolve(null);
                }
            });
        });
    }

    // Obtiene un profesor por su ID de la base de datos
    async getTeacher(teacherId: string): Promise<TeacherI | null> {
        try {
          const res = await this.firestoreService.getDocument<TeacherI>(`Teachers/${teacherId}`);
          return res.data();
        } catch (error) {
          console.error('Error obteniendo el profesor:', error);
          return null;
        }
      }

    // Añade un nuevo profesor a la base de datos
    async addTeacher(teacher: TeacherI): Promise<void> {
        try {
          teacher.id = this.firestoreService.createIDDoc();
          await this.firestoreService.createDocumentID(teacher, 'Teachers', teacher.id);
          console.log('Profesor añadido con éxito:', teacher);
        } catch (error) {
          console.error('Error añadiendo el profesor:', error);
        }
      }

      //Edita un profesor existente en la base de datos
      async editTeacher(teacher: TeacherI): Promise<void> {
        try {
        // POR IMPLEMENTAR
        //   await this.firestoreService.createDocumentID(teacher, 'Teachers', teacher.id);
          console.log('Sin implementar');
        } catch (error) {
          console.error('Error editando el profesor:', error);
        }
      }

      //Elimina un profesor de la base de datos
      async deleteTeacher(teacherId: string): Promise<void> {
        try {
          await this.firestoreService.deleteDocumentID('Teachers', teacherId);
          console.log('Profesor eliminado:', teacherId);
        } catch (error) {
          console.error('Error eliminando el profesor:', error);
        }
      }

      // Limpia los campos de un profesor (se usa en el formulario cuandos se añade un profesor a la BD)
      cleanTeacherInterface(teacher: TeacherI): void {
        for (const key in teacher) {
          if (teacher.hasOwnProperty(key)) 
            (teacher as any)[key] = null;
        }
    }
}