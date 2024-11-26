export interface TeacherI{
    id: string; //Auto-generado
    name: string;
    surname: string;
    pictogramId: string;
    email: string;
    password: string;
    administrative: boolean;
    birthdate?: Date;
    phone?: number;
    personalData?: string;
}
