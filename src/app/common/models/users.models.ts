export interface UserI{
    nombre: string;
    edad?: number;
    id: string;
    password: string;
    correctPassword: Array<number>;
    TipoDiscapacidad: Array<string>;
    id_pictogram: string;
}
