import { DocumentReference, Timestamp } from "firebase/firestore";

//Modelo para las tareas
export interface TaskI {
    taskID: string;                 //ID único de la tarea
    title: string;                  //Título de la tarea
    startTime?: Timestamp;          //Tiempo de inicio de la tarea
    endTime?: Timestamp;            //Tiempo de finalización planificado
    type: string;                   //Tipo de tarea, por ejemplo, "AppTask", "ManualTask", etc.
    associatedDescriptionId: string;//Id de la descripción asociada
    descriptionData: DescriptionI | null;  //Referencia a la descripción de la tarea
    // Nuevas propiedades para gestionar asignaciones
    assigned: string[];  // Nombres o IDs de los alumnos asignados
    completed: boolean[];           // Estado de finalización por alumno
    doneTime?: Timestamp[];         // Tiempos de finalización por alumno
}

//Modelo para la descripción de las tareas
export interface DescriptionI {
    descriptionId: string;      //ID único para la descripción
    imagesId?: string[];        //Array de IDs de imágenes(por ahora opcional hasta añadirle como poner imagenes)
    pictogramId: string;        //Array de IDs de pictogramas(por ahora opcional hasta añadirle comoponer pictogramas)
    text: string;               //Descripción de la tarea
    link?: string;              //Enlace, solo para tareas de tipo AppTask
    steps?: StepI[];            //Pasos de tarea tipo StepTask
}

//Modelo para un paso
export interface StepI {
    text: string;               // Descripción del paso
    pictogramId?: string;       // Pictograma asociado al paso
    imageUrl? : string;         // Imagen asociada al paso (url)
    videoUrl?: string;          // Vídeo asociado al paso (url)
}