import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/common/services/session.service'; // Importa el servicio

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
  userActual: any;

  constructor(private fb: FormBuilder,
              private sessionService: SessionService,  // Inyecta el servicio
              private router: Router // Para redirigir si no tiene permisos
  ) {}

  ngOnInit() {
    // Verificar si el usuario está logueado y tiene permisos de administrador
    const user = this.sessionService.getCurrentUser();
    if (user && 'administrative' in user && !user.administrative)  {
      this.userActual = user;
      console.log('Profesor loggeado:', this.userActual.name);
    } else {
      console.error('El usuario actual no es válido o no tiene permisos de administrador.');
      this.router.navigate(['/loginprofesor']); // Redirigir al login si no tiene permisos
      return; // Detenemos la ejecución si el usuario no es válido
    }

    // Inicialización del formulario
    this.requestForm = this.fb.group({
      profesor: [this.userActual.name, [Validators.required]],
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

      // Reestablecer el valor de 'profesor' con el nombre del usuario logueado después del reset
      this.requestForm.patchValue({
        profesor: this.userActual.name,
      });

    } catch (e) {
      console.error('Error añadiendo el documento: ', e);
      alert('Hubo un error al enviar la solicitud.');
    }
  }
}
