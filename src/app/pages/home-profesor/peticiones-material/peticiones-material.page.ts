import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service';
import { RequestsService } from '../../../common/services/peticiones.service';

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
  availableColors: { [materialName: string]: string[] } = {}; // Almacenar los colores por material
  availableTamanos: { [materialName: string]: string[] } = {}; // Almacenar los tamaños por material

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

    // Escuchar cambios en los materiales
    this.materiales.valueChanges.subscribe(() => {
      // Llamamos a la función que verifica los colores disponibles
      this.materiales.controls.forEach((material, index) => {
        this.updateAvailableColors(index); // Llamamos para cada material
        this.updateAvailableTamanos(index); // Actualizar tamaños
      });
    });
  }

  get materiales(): FormArray {
    return this.requestForm.get('materiales') as FormArray;
  }

  createMaterialGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      tamano: [''],
      color: [''],
    });
  }

  addMaterial() {
    this.materiales.push(this.createMaterialGroup());
  }

  // Función para actualizar los colores disponibles cuando el nombre del material cambia
  async updateAvailableColors(materialIndex: number) {
    const materialName = this.materiales.at(materialIndex).get('nombre')?.value;
    if (materialName) {
      const colors = await this.requestsService.getAvailableColors(materialName);
      this.availableColors[materialName] = colors;
  
      // Establecer el color seleccionado en el formulario a 'NoEspecificado' si no está entre los disponibles
      const selectedColor = this.materiales.at(materialIndex).get('color')?.value;
      if (selectedColor && !colors.includes(selectedColor)) {
        this.materiales.at(materialIndex).get('color')?.setValue(''); // Limpiar el color si no es válido
      }
    }
  }
  // Función para actualizar los tamaños disponibles cuando el nombre del material cambia
  async updateAvailableTamanos(materialIndex: number) {
    const materialName = this.materiales.at(materialIndex).get('nombre')?.value;
    if (materialName) {
      const tamanos = await this.requestsService.getAvailableTamanos(materialName);
      this.availableTamanos[materialName] = tamanos;
  
      // Verificar si el tamaño seleccionado ya está disponible
      const selectedTamano = this.materiales.at(materialIndex).get('tamano')?.value;
      if (selectedTamano && !tamanos.includes(selectedTamano)) {
        // Si el tamaño no es válido, lo limpiamos (pero no lo limpiamos si es válido)
        this.materiales.at(materialIndex).get('tamano')?.setValue('');
      }
    }
  }
  
  

  // Al enviar la solicitud, verificar todos los materiales como antes
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
        alert(`El material ${material.nombre} no está disponible en el inventario.`);
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
        alert(`No hay suficiente cantidad de ${material.nombre} en el inventario.`);
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
      // Enviar solicitud si todo es válido
      await this.requestsService.sendRequest(formData);
      alert('Solicitud enviada correctamente.');
  
      // Reiniciar el formulario correctamente
      this.requestForm.reset(); // Resetear el formulario
      this.materiales.clear(); // Limpiar el FormArray
  
      // Asegurarse de que el primer grupo de material esté presente
      this.materiales.push(this.createMaterialGroup());
  
      // Volver a establecer el valor por defecto del campo 'profesor' para la nueva solicitud
      this.requestForm.patchValue({
        profesor: this.userActual.name,
      });
  
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar la solicitud.');
    }
  }
  
  

  goBack() {
    window.history.back();
  }
}
