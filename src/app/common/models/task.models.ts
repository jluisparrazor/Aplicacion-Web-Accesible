import { DocumentReference, Timestamp } from "firebase/firestore";

//Modelo para las tareas
export interface TaskI {
    taskID: string;                 //ID único de la tarea
    startTime?: Timestamp;           //Tiempo de inicio de la tarea
    endTime?: Timestamp;             //Tiempo de finalización planificado
    doneTime?: Timestamp;           //Tiempo en que la tarea se completó realmente
    type: string;                   //Tipo de tarea, por ejemplo, "AppTask", "ManualTask", etc.
    completed: boolean;             //Estado de la tarea (completada o no)
    assigned?: DocumentReference;   //Nombre del alumno asignado
    associatedDescriptionId: string;//Id de la descripción asociada
    descriptionData: DescriptionI; //Referencia a la descripción de la tarea
}

//Modelo para la descripción de las tareas
export interface DescriptionI {
    title: string;              //Título o nombre descriptivo de la tarea
    descriptionId: string;      //ID único para la descripción
    imagesId?: string[];        //Array de IDs de imágenes(por ahora opcional hasta añadirle como poner imagenes)
    pictogramsId?: string[];    //Array de IDs de pictogramas(por ahora opcional hasta añadirle comoponer pictogramas)
    text: string;               //Descripción de la tarea
    link?: string;              //Enlace, solo para tareas de tipo AppTask
}