import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root', // Para usar este componente como un servicio en toda la aplicación
})
export class AlertService {
  constructor(private alertController: AlertController) {}

  /**
   * Método para mostrar una alerta simple
   * @param header Título del alerta
   * @param message Mensaje del alerta
   * @param buttonText Texto del botón
   */
  async showAlert(header: string, message: string, buttonText: string = 'OK'): Promise<void> {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [buttonText],
      mode: 'ios'
    });

    await alert.present();
  }

  /**
   * Método para mostrar una confirmación
   * @param header Título de la confirmación
   * @param message Mensaje de la confirmación
   * @returns Promise<boolean> Devuelve `true` si se confirma, `false` en caso contrario
   */
  async showConfirm(header: string, message: string): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header,
        message,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false),
          },
          {
            text: 'OK',
            handler: () => resolve(true),
          },
        ],
        mode: 'ios'
      });

      await alert.present();
    });
  }
}
