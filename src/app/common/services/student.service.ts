import { Injectable } from "@angular/core";
import { StudentI } from "../models/student.models";
import { FirestoreService } from "./firestore.service";

@Injectable({
  providedIn: 'root' // Disponible en toda la aplicación
})
export class StudentService {
  constructor(private readonly firestoreService: FirestoreService) {}

  // Inicializa un estudiante con los campos a null menos el id
  initStudent(): StudentI {
    const newStudent: StudentI = {
      id: this.firestoreService.createIDDoc(),
      name: null,
      surname: null,
      dni: null,
      pictogramId: null,
      phone: null,
      personalData: null,
      birthDate: null,
      loginType: false,
      correctPassword: null,
    };
    return newStudent;
  }

  // Obtiene todos los estudiantes de la base de datos
  loadStudents(): Promise<StudentI[]> {
    return new Promise((resolve) => {
      this.firestoreService.getCollectionChanges<StudentI>('Students').subscribe((data) => {
        if (data) {
          console.log('Estudiantes cargados con éxito');
          resolve(data);
        } else {
          console.log('No hay estudiantes en la base de datos');
          resolve(null);
        }
      });
    });
  }

  // Obtiene un estudiante por su ID de la base de datos
  async getStudent(studentId: string): Promise<StudentI | null> {
    try {
      const res = await this.firestoreService.getDocument<StudentI>(`Students/${studentId}`);
      return res.data();
    } catch (error) {
      console.error('Error obteniendo el estudiante:', error);
      return null;
    }
  }

  // Añade un nuevo estudiante a la base de datos
  async addStudent(student: StudentI): Promise<void> {
    try {
      student.id = this.firestoreService.createIDDoc();
      await this.firestoreService.createDocumentID(student, 'Students', student.id);
      console.log('Estudiante añadido con éxito:', student);
    } catch (error) {
      console.error('Error añadiendo el estudiante:', error);
    }
  }

  // Edita un estudiante existente en la base de datos
  async editStudent(student: StudentI): Promise<void> {
    try {
      // await this.firestoreService.createDocumentID(student, 'Students', student.id);
      // console.log('Estudiante editado con éxito:', student);
      console.log("Todavía sin implementar");
    } catch (error) {
      console.error('Error editando el estudiante:', error);
    }
  }

  // Elimina un estudiante de la base de datos
  async deleteStudent(studentId: string): Promise<void> {
    try {
      await this.firestoreService.deleteDocumentID('Students', studentId);
      console.log('Estudiante eliminado:', studentId);
    } catch (error) {
      console.error('Error eliminando el estudiante:', error);
    }
  }

  // Limpia los campos de un estudiante (se usa en el formulario cuando se añade un estudiante a la BD)
  cleanStudentInterface(student: StudentI): void {
    for (const key in student) {
      if (student.hasOwnProperty(key)) {
        (student as any)[key] = null;
      }
    }
    // Restaura los valores por defecto
    student.loginType = false;
  }
}
