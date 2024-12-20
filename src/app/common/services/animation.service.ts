import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private animacionCallback: ((ruta: string, texto: boolean) => void) | null = null;

  setAnimacionCallback(callback: (ruta: string, texto: boolean) => void) {
    this.animacionCallback = callback;
  }

  activarAnimacion(ruta: string, texto: boolean = true) {
    if (this.animacionCallback) {
      this.animacionCallback(ruta, texto);
    }
  }
}