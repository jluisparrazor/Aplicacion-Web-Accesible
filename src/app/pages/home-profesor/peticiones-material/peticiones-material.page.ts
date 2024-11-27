import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';

@Component({
  selector: 'app-peticiones-material',
  templateUrl: './peticiones-material.page.html',
  styleUrls: ['./peticiones-material.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class PeticionesMaterialPage implements OnInit {
  requestForm: FormGroup;
  firestore: Firestore = inject(Firestore);

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.requestForm = this.fb.group({
      profesor: ['', [Validators.required]],
      clase: ['', [Validators.required]],
      materiales: this.fb.array([this.createMaterialGroup()]), // Inicializa con un grupo para material
    });
  }

  // Acceso al FormArray de materiales
  get materiales(): FormArray {
    return this.requestForm.get('materiales') as FormArray;
  }

  // Crear un FormGroup para material
  createMaterialGroup(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]], // Campo obligatorio
      cantidad: [1, [Validators.required, Validators.min(1)]], // Campo obligatorio con mínimo de 1
    });
  }

  // Añadir un material al array
  addMaterial() {
    this.materiales.push(this.createMaterialGroup());
  }

  // Enviar formulario
  async finalizeRequests() {
    if (this.requestForm.invalid) {
      alert('Debe completar todos los campos correctamente antes de enviar.');
      return;
    }

    // Extraer los valores del formulario
    const formData = this.requestForm.value;
    const requestData = {
      profesor: formData.profesor,
      clase: formData.clase,
      materiales: formData.materiales.map((material: any) => ({
        nombre: material.nombre,
        cantidad: material.cantidad,
      })),
    };

    // Guardar en Firestore
    try {
      const docRef = await addDoc(collection(this.firestore, 'Requests'), requestData);
      console.log('Solicitud enviada con ID: ', docRef.id);
      alert('Solicitud enviada correctamente.');

      // Reiniciar el formulario
      this.requestForm.reset();
      this.materiales.clear();
      this.materiales.push(this.createMaterialGroup());
    } catch (e) {
      console.error('Error añadiendo el documento: ', e);
      alert('Hubo un error al enviar la solicitud.');
    }
  }
}
