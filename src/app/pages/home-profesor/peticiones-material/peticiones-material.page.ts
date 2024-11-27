import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-peticiones-material',
  templateUrl: './peticiones-material.page.html',
  styleUrls: ['./peticiones-material.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class PeticionesMaterialPage implements OnInit {
  requestForm: FormGroup;

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
  finalizeRequests() {
    if (this.requestForm.invalid) {
      alert('Debe completar todos los campos correctamente antes de enviar.');
      return;
    }

    // Extraer los valores del formulario
    const formData = this.requestForm.value;
    let resumen = `Profesor: ${formData.profesor}\nClase: ${formData.clase}\nMateriales:\n`;

    // Iterar sobre los materiales
    formData.materiales.forEach((material: any, index: number) => {
      resumen += `${index + 1}. Material: ${material.nombre} - Cantidad: ${material.cantidad}\n`;
    });

    // Mostrar los datos en una alerta
    alert(resumen);

    // Reiniciar el formulario
    this.requestForm.reset();

    // Restaurar la estructura inicial del formulario
    this.materiales.clear();
    this.materiales.push(this.createMaterialGroup());
  }
}
