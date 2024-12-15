import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { RequestsService } from '../../../../common/services/peticiones.service';

@Component({
  selector: 'app-peticiones-material',
  templateUrl: './peticiones-material.page.html',
  styleUrls: ['./peticiones-material.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class PeticionesMaterialPage implements OnInit {
  requestForm: FormGroup;
  userActual: any;

  constructor(
    private fb: FormBuilder,
    private sessionService: SessionService,
    private router: Router,
    private requestsService: RequestsService
  ) {}

  ngOnInit() {
    const user = this.sessionService.getCurrentUser();
    if (user && 'administrative' in user && !user.administrative) {
      this.userActual = user;
      console.log('Profesor loggeado:', this.userActual.name);
    } else {
      console.error('El usuario actual no es válido o no tiene permisos de administrador.');
      this.router.navigate(['/loginprofesor']);
      return;
    }

    this.requestForm = this.fb.group({
      profesor: [this.userActual.name, [Validators.required]],
      clase: ['', [Validators.required]],
      materiales: this.fb.array([this.createMaterialGroup()]),
    });
  }

  get materiales(): FormArray {
    return this.requestForm.get('materiales') as FormArray;
  }

  createMaterialGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tamano: [''], // Nuevo campo
      color: [''],  // Nuevo campo
    });
  }
  

  addMaterial() {
    this.materiales.push(this.createMaterialGroup());
  }

  async finalizeRequests() {
    if (this.requestForm.invalid) {
      alert('Debe completar todos los campos correctamente antes de enviar.');
      return;
    }
  
    const formData = this.requestForm.value;
  
    for (const material of formData.materiales) {
      // Normalizar los campos
      material.nombre = this.requestsService.normalizeText(material.nombre);
      material.tamano = this.requestsService.normalizeText(material.tamano);
      material.color = this.requestsService.normalizeText(material.color);
  
      // Validar existencia en el inventario
      const exists = await this.requestsService.checkMaterialExists(material.nombre, material.tamano, material.color);
      if (!exists) {
        alert(`El material no está disponible en el invetario.`);
        return;
      }
  
      // Validar cantidad suficiente en el inventario
      const hasSufficientQuantity = await this.requestsService.checkMaterialQuantity(
        material.nombre,
        material.tamano,
        material.color,
        material.cantidad
      );
      if (!hasSufficientQuantity) {
        alert(`No hay suficiente cantidad del material en el inventario.`);
        return;
      }
  
      // Actualizar el inventario restando la cantidad solicitada
      try {
        await this.requestsService.updateMaterialQuantity(
          material.nombre,
          material.tamano,
          material.color,
          material.cantidad
        );
      } catch (error) {
        console.error('Error al actualizar el inventario:', error);
        alert('Hubo un error al actualizar el inventario.');
        return; // Detenemos el proceso si algo sale mal
      }
    }
  
    try {
      await this.requestsService.sendRequest(formData); // Enviar solicitud si todo es válido
      alert('Solicitud enviada correctamente.');
  
      // Reiniciar el formulario correctamente
      this.requestForm.reset(); // Resetear el formulario
      this.materiales.clear(); // Limpiar el FormArray
  
      // Asegurarse de que el primer grupo de material esté presente
      this.materiales.push(this.createMaterialGroup());
  
      // Volver a establecer el valor por defecto del campo profesor
      this.requestForm.patchValue({
        profesor: this.userActual.name,
      });
  
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar la solicitud.');
    }
  }
  
  
}
