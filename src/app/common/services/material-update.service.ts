import { Injectable } from '@angular/core';
import { Firestore, collection, getDocs, query, where, updateDoc, addDoc, doc, Timestamp } from '@angular/fire/firestore';
import { MaterialI } from '../models/material.models';

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  constructor(private firestore: Firestore) {}

  // Función para normalizar cadenas de texto
  normalizeText(input: string): string {
    if (!input || input.trim() === '') return 'NoEspecificado'; // Reemplaza cadenas vacías con algo identificable
    return input.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }
  
  // Función para obtener nombres del inventario
  // Función para obtener nombres del inventario
async fetchInventoryNames(): Promise<string[]> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const querySnapshot = await getDocs(inventoryCollection);
  
    // Mapear a los datos esperados con una aserción de tipo
    const nombres = querySnapshot.docs.map(doc => {
      const data = doc.data() as MaterialI; // Asegura que la estructura de datos es correcta
      return data.nombre;
    }).filter(name => !!name);
  
    return [...new Set(nombres)]; // Eliminar duplicados
  }
  
  // Generar una clave única basada en los atributos del material
  generateKey(material: MaterialI): string {
    const nombre = this.normalizeText(material.nombre);
    const color = this.normalizeText(material.color || '');
    const tamano = this.normalizeText(material.tamano || '');
    return `${nombre}-${color}-${tamano}`.trim();
  }
  //Ver materiales en Firestore
  async fetchInventory(): Promise<any[]> {
    const inventoryCollection = collection(this.firestore, 'Inventory');
    const querySnapshot = await getDocs(inventoryCollection);
  
    return querySnapshot.docs.map(doc => {
      const atributos = doc.data()['atributos'] || {};
  
      // Debug para verificar atributos
      if (!atributos['tamano']) {
        console.warn(`El documento con ID ${doc.id} no tiene definido el atributo 'tamano'.`);
      }
  
      return {
        id: doc.id,
        ...doc.data(),
        tamano: Array.isArray(atributos['tamano']) ? atributos['tamano'][0] : 'NoEspecificado',

        color: atributos['color']?.[0] ?? 'NoEspecificado',
      };
    });
  }
  
  //Comprobar
  async logInventoryDetails(): Promise<void> {
    try {
      const inventoryCollection = collection(this.firestore, 'Inventory');
      const querySnapshot = await getDocs(inventoryCollection);
  
      console.log('Detalles del inventario:');
      querySnapshot.docs.forEach(doc => {
        const data = doc.data();
        const atributos = data['atributos'] || {};
        
        console.log({
          id: doc.id,
          nombre: data['nombre'] || 'NoEspecificado',
          cantidad: data['cantidad'] || 0,
          tamano: atributos['tamano'] || ['NoEspecificado'],
          color: atributos['color'] || ['NoEspecificado'],
          atributos: atributos,
        });
      });
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
    }
  }
  
  // Guardar materiales en Firestore
  async saveMaterials(materiales: MaterialI[]): Promise<void> {
    const inventoryCollection = collection(this.firestore, 'Inventory');

    for (const material of materiales) {
      const normalizedMaterial = {
        ...material,
        nombre: this.normalizeText(material.nombre),
        color: this.normalizeText(material.color || ''),
        tamano: this.normalizeText(material.tamano || ''),
        clave: this.generateKey(material),
      };

      const materialQuery = query(inventoryCollection, where('clave', '==', normalizedMaterial.clave));
      const querySnapshot = await getDocs(materialQuery);

      if (querySnapshot.size > 0) {
        // Si el material ya existe, actualiza la cantidad
        const existingMaterialDoc = querySnapshot.docs[0];
        const existingMaterialData = existingMaterialDoc.data() as MaterialI;
        const cantidadActual = existingMaterialData.cantidad || 0;

        await updateDoc(doc(this.firestore, 'Inventory', existingMaterialDoc.id), {
          cantidad: cantidadActual + normalizedMaterial.cantidad,
        });
      } else {
        // Si no existe, agrega un nuevo documento
        await addDoc(inventoryCollection, {
            ...normalizedMaterial,
            atributos: {
              color: normalizedMaterial.color ? [normalizedMaterial.color] : ['NoEspecificado'],
              tamano: normalizedMaterial.tamano ? [normalizedMaterial.tamano] : ['NoEspecificado'],
            },
        });
        
      }
    }
  }
}
