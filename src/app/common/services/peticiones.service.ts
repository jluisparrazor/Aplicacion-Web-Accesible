import { Injectable } from '@angular/core';
import { Firestore, collection, query, where, getDocs, addDoc,doc,updateDoc } from '@angular/fire/firestore';

// Definición de la interfaz para los datos del inventario
interface InventoryItem {
  nombre: string;
  tamano: string;
  color: string;
  cantidad: number; // Esta propiedad debe ser de tipo number
}

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private firestore: Firestore) {}

  // Verificar si el material existe en el inventario
  async checkMaterialExists(nombre: string, tamano: string, color: string): Promise<boolean> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
  
    // Normalizar tamano y color
    const normalizedTamano = tamano?.trim() === '' || !tamano ? 'NoEspecificado' : tamano;
    const normalizedColor = color?.trim() === '' || !color ? 'NoEspecificado' : color;
  
    // Construir una lista de condiciones dinámicamente
    const conditions = [
      where('nombre', '==', nombre),
      where('tamano', '==', normalizedTamano),
      where('color', '==', normalizedColor),
    ];
  
    // Crear una sola consulta con todas las condiciones
    const q = query(inventoryCollection, ...conditions);
  
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  }
  
  
  
  
  // Obtener los materiales disponibles
  async getAvailableMaterials(): Promise<string[]> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const querySnapshot = await getDocs(inventoryCollection);
    const materials: string[] = [];
  
    querySnapshot.forEach((doc) => {
      const material = doc.data() as InventoryItem;
      const normalizedNombre = material.nombre ? material.nombre : 'NoEspecificado';
      if (normalizedNombre && !materials.includes(normalizedNombre)) {
        materials.push(normalizedNombre);
      }
    });
  
    return materials;
  }
  
  // En tu servicio RequestsService
  async getAvailableClasses(): Promise<string[]> {
    const classesCollection = collection(this.firestore, 'Classes'); // Asumiendo que las clases están en una colección llamada "Classes"
    const querySnapshot = await getDocs(classesCollection);
    const classes: string[] = [];

    querySnapshot.forEach((doc) => {
      const clase = doc.data()['name']; // Using bracket notation to access the property

      if (clase && !classes.includes(clase)) {
        classes.push(clase);
      }
    });

    return classes;
  }

  async getAvailableColors(nombre: string): Promise<string[]> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const q = query(inventoryCollection, where('nombre', '==', nombre));

    const querySnapshot = await getDocs(q);
    const colors: string[] = [];

    querySnapshot.forEach((doc) => {
      const material = doc.data() as InventoryItem;
      if (material.color && !colors.includes(material.color)) {
        colors.push(material.color);
      }
    });

    return colors;
  }
  // Recupera los tamaños disponibles para un material
  async getAvailableTamanos(nombre: string): Promise<string[]> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const q = query(inventoryCollection, where('nombre', '==', nombre));

    const querySnapshot = await getDocs(q);
    const tamanos: string[] = [];

    querySnapshot.forEach((doc) => {
      const material = doc.data() as InventoryItem;
      if (material.tamano && !tamanos.includes(material.tamano)) {
        tamanos.push(material.tamano);
      }
    });

    return tamanos;
  }

  // Obtener los colores disponibles para un tamaño específico
  async getAvailableColorsForTamano(nombre: string, tamano: string): Promise<string[]> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const q = query(
      inventoryCollection,
      where('nombre', '==', nombre),
      where('tamano', '==', tamano || 'NoEspecificado')
    );
  
    const querySnapshot = await getDocs(q);
    const colors: string[] = [];
  
    querySnapshot.forEach((doc) => {
      const material = doc.data() as InventoryItem;
      if (material.color && !colors.includes(material.color)) {
        colors.push(material.color);
      }
    });
  
    return colors;
  }
  
  
  

  // Obtener los tamaños disponibles para un color específico
  async getAvailableTamanosForColor(nombre: string, color: string): Promise<string[]> {
    // Referencia a la colección de inventario
    const inventoryCollection = collection(this.firestore, 'Inventory');
  
    // Consulta por nombre y color específicos
    const q = query(
      inventoryCollection,
      where('nombre', '==', nombre),
      where('color', '==', color)
    );
  
    // Ejecutar la consulta y obtener resultados
    const querySnapshot = await getDocs(q);
    const tamanos: Set<string> = new Set(); // Utilizamos un Set para evitar duplicados
  
    // Iterar sobre los documentos y recoger los tamaños
    querySnapshot.forEach((doc) => {
      const material = doc.data() as InventoryItem;
      if (material.tamano) {
        tamanos.add(material.tamano); // Agregar el tamaño si existe
      }
    });
  
    // Convertir el Set a un array y devolver
    return Array.from(tamanos);
  }
  




    // Verificar si el material tiene suficiente cantidad en el inventario
    async checkMaterialQuantity(
      nombre: string,
      tamano: string,
      color: string,
      cantidadSolicitada: number
    ): Promise<boolean> {
      const inventoryCollection = collection(this.firestore, 'Inventory');
    
      // Normalizar tamano y color
      const normalizedTamano = tamano?.trim() === '' || !tamano ? 'NoEspecificado' : tamano;
      const normalizedColor = color?.trim() === '' || !color ? 'NoEspecificado' : color;
    
      const q = query(
        inventoryCollection,
        where('nombre', '==', nombre),
        where('tamano', '==', normalizedTamano),
        where('color', '==', normalizedColor)
      );
    
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        return false; // El material no existe
      }
    
      const doc = querySnapshot.docs[0];
      const inventoryData = doc.data() as InventoryItem;  // Asegúrate de que inventoryData sea de tipo InventoryItem
      return inventoryData.cantidad >= cantidadSolicitada; // Verifica si hay suficiente cantidad
    }
    
  async updateMaterialQuantity(nombre: string, tamano: string, color: string, cantidadSolicitada: number): Promise<void> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const q = query(
      inventoryCollection,
      where('nombre', '==', nombre),
      where('tamano', '==', tamano || 'NoEspecificado'),
      where('color', '==', color || 'NoEspecificado')
    );
  
    const querySnapshot = await getDocs(q);
  
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const inventoryRef = doc.ref;
  
      const inventoryData = doc.data();
      const nuevaCantidad = inventoryData['cantidad'] - cantidadSolicitada;
  
      if (nuevaCantidad < 0) {
        throw new Error('Cantidad insuficiente para actualizar.');
      }
  
      await updateDoc(inventoryRef, { cantidad: nuevaCantidad });
    } else {
      throw new Error(`El material "${nombre}" no se encuentra en el inventario.`);
    }
  }
  

  // Función para enviar datos a Firestore
  async sendRequest(requestData: any): Promise<void> {
    try {
      const docRef = await addDoc(collection(this.firestore, 'Requests'), requestData);
      console.log('Solicitud enviada con ID:', docRef.id);
    } catch (error) {
      console.error('Error al enviar la solicitud: ', error);
      throw new Error('No se pudo enviar la solicitud');
    }
  }

  // Función para normalizar cadenas de texto
  normalizeText(input: string): string {
    if (!input || input.trim() === '') return 'NoEspecificado';
    return input.trim();
  }
  
}
