import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {
  constructor(private firestore: Firestore) {}

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
    return input.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }
}
