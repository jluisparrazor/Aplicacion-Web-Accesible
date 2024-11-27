export interface StudentI{
    id: string,
    name: string,
    surname: string,
    dni: string,
    pictogramId: string,
    phone?: number
    personalData?: string,
    birthDate?: Date
    disabilities: {
        visual: boolean;
        auditory: boolean;
        motor: boolean;
        cognitive: boolean;
      };
    loginType: boolean,
    correctPassword?: Array<number>,
}
