export interface RequestI{
    id: string;
    materiales: {
        cantidad: number;
        color: string;
        nombre: string;
        tamano: string;
    }[];
    profesor: string;
    clase: string;
}
// Debería tener un atributo de id
// Profesor y clase deberían ser ID para poder obtener los pictogramas
// Materiales debería ser map o vector de id de material a cantidad