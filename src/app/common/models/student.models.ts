export interface StudentI{
    id: string,
    name: string,
    surname: string,
    dni: string,
    pictogramId: string,
    phone?: number
    personalData?: string,
    birthDate?: Date
    loginType: boolean,
    correctPassword?: Array<number>,
}

export function isStudent(obj: any): obj is StudentI {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.id === 'string' &&
        typeof obj.name === 'string' &&
        typeof obj.surname === 'string' &&
        typeof obj.dni === 'string' &&
        typeof obj.pictogramId === 'string' &&
        (typeof obj.phone === 'undefined' || typeof obj.phone === 'number') &&
        (typeof obj.personalData === 'undefined' || typeof obj.personalData === 'string') &&
        (typeof obj.birthDate === 'undefined' || obj.birthDate instanceof Date) &&
        typeof obj.loginType === 'boolean' &&
        (typeof obj.correctPassword === 'undefined' || Array.isArray(obj.correctPassword))
    );
}