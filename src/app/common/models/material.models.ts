export interface MaterialI {
  nombre: string;             // Nombre del material
  cantidad: number;           // Cantidad de material
  color?: string;             // Color (opcional)
  tamano?: string;            // Tamaño (opcional)
  clave: string;              // Clave única generada
  atributos?: {               // Información adicional de atributos
    color?: string[];
    tamano?: string[];        // Tamaño del material
  };
}
