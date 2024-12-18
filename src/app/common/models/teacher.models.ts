export interface TeacherI{
    id: string; //Auto-generado
    name: string;
    surname: string;
    dni: string,
    pictogramId: string;
    email: string;
    password: string;
    administrative: boolean;
    birthdate?: Date;
    phone?: number;
}

export function isTeacher(obj: any): obj is TeacherI {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.surname === 'string' &&
        typeof obj.dni === 'string' &&
        typeof obj.pictogramId === 'string' &&
        typeof obj.email === 'string' &&
        typeof obj.password === 'string' &&
        typeof obj.administrative === 'boolean' &&
        (typeof obj.birthdate === 'undefined' || obj.birthdate instanceof Date) &&
        (typeof obj.phone === 'undefined' || typeof obj.phone === 'number')
    );
}