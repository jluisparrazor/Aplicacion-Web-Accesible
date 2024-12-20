import { DocumentReference, Timestamp } from "firebase/firestore";

export interface TaskI {
    taskID: string;                 // ID único de la tarea
    title: string;                  // Título de la tarea
    type: string;                   // Tipo de tarea
    associatedDescriptionId: string;// Id de la descripción asociada
    descriptionData: DescriptionI | null; // Referencia a la descripción de la tarea
    assigned: {                     // Lista de asignaciones a alumnos
        assignedName: string | null;       // Nombre del alumno
        assignedId: string | null;         // ID del alumno
        completed: boolean;         // Estado de completado
        nStepsCompleted?: number;       // Número de pasos completados, si tiene pasos
        doneTime?: Timestamp | null;  // Fecha específica de finalización        
        startTime?: Timestamp | null; // Fecha específica de inicio para este alumno
        endTime?: Timestamp | null;   // Fecha específica de fin para este alumno       
    }[];                            
}

//Modelo para la descripción de las tareas
export interface DescriptionI {
    descriptionId: string;      //ID único para la descripción
    imagesId?: string[];        //Array de IDs de imágenes(por ahora opcional hasta añadirle como poner imagenes)
    pictogramId: string;        //Array de IDs de pictogramas(por ahora opcional hasta añadirle comoponer pictogramas)
    text: string;               //Descripción de la tarea
    link?: string;              //Enlace, solo para tareas de tipo AppTask
    steps?: StepI[];            //Pasos de tarea tipo StepTask
    pictograms:string[];       //Array de IDs de pictogramas
}

//Modelo para un paso
export interface StepI {
    text: string;               // Descripción del paso
    pictogramId?: string;       // Pictograma asociado al paso
    imageUrl? : string;         // Imagen asociada al paso (url)
    videoUrl?: string;          // Vídeo asociado al paso (url)
}