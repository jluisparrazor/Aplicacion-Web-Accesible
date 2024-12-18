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
    stepVisualization: string
}
