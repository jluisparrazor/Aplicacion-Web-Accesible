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
      tamano: ['', [Validators.required]], // Nuevo campo
      color: ['', [Validators.required]],  // Nuevo campo
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
  
    // Normalizar los campos de cada material antes de enviar los datos
    this.materiales.controls.forEach((control) => {
      const nombreControl = control.get('nombre');
      const tamanoControl = control.get('tamano'); // Obtener el control del tamaño
      const colorControl = control.get('color');  // Obtener el control del color
  
      if (nombreControl) {
        const normalizedName = this.requestsService.normalizeText(nombreControl.value);
        nombreControl.setValue(normalizedName);
      }
  
      if (tamanoControl) {
        const normalizedTamano = this.requestsService.normalizeText(tamanoControl.value);
        tamanoControl.setValue(normalizedTamano);
      }
  
      if (colorControl) {
        const normalizedColor = this.requestsService.normalizeText(colorControl.value);
        colorControl.setValue(normalizedColor);
      }
    });
  
    const formData = this.requestForm.value;
  
    try {
      await this.requestsService.sendRequest(formData); // Enviar los datos ya normalizados
      alert('Solicitud enviada correctamente.');
  
      this.requestForm.reset();
      this.materiales.clear();
      this.materiales.push(this.createMaterialGroup());
      this.requestForm.patchValue({
        profesor: this.userActual.name,
      });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      alert('Hubo un error al enviar la solicitud.');
    }
  }
  
}
