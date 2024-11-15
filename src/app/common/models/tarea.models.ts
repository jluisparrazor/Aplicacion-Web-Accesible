import { Timestamp } from "firebase/firestore";

export interface TareaI{
    id: string;
    Nombre: string;
    Completada: boolean;
    Fecha?: Timestamp;
}
