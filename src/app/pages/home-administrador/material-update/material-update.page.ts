import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Firestore, collection, getDocs, query, where, updateDoc, addDoc, doc } from '@angular/fire/firestore';

@Component({
  selector: 'app-material-update',
  templateUrl: './material-update.page.html',
  styleUrls: ['./material-update.page.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, IonicModule],
})
export class MaterialUpdatePage implements OnInit {
  materialForm: FormGroup;
  firestore: Firestore;

  constructor(private fb: FormBuilder, firestore: Firestore) {
    this.firestore = firestore;
  }

  ngOnInit() {
    // Inicializar el formulario con un solo material en FormArray
    this.materialForm = this.fb.group({
      materiales: this.fb.array([this.createMaterial()]), // Comienza con un solo material
    });
  }

  // Crear un nuevo grupo de controles para cada material
  createMaterial(): FormGroup {
    return this.fb.group({
      nombre: ['', [Validators.required]], // Campo obligatorio
      cantidad: [1, [Validators.required, Validators.min(1)]], // Mínimo 1 unidad
      color: [''], // Atributo opcional
      tamaño: [''], // Atributo opcional
    });
  }

  // Getter para acceder al array de materiales
  get materiales(): FormArray {
    return this.materialForm.get('materiales') as FormArray;
  }

  // Función para estandarizar cadenas de texto (Capital Case)
  normalizeText(input: string): string {
    if (!input) return '';
    return input.trim().toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
  }

  // Generar una clave única basada en los atributos
  generateKey(material: any): string {
    const nombre = this.normalizeText(material.nombre);
    const color = this.normalizeText(material.color || '');
    const tamaño = this.normalizeText(material.tamaño || '');
    return `${nombre}-${color}-${tamaño}`.trim(); // Combinar en un único campo
  }

  // Enviar datos al servidor Firebase
  async submitMaterials() {
    if (this.materialForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      const inventoryCollection = collection(this.firestore, 'Inventory');
      const materiales = this.materialForm.value.materiales;

      for (const material of materiales) {
        const normalizedMaterial = {
          nombre: this.normalizeText(material.nombre),
          cantidad: material.cantidad,
          color: this.normalizeText(material.color),
          tamaño: this.normalizeText(material.tamaño),
          clave: this.generateKey(material), // Generar clave única
        };

        const materialQuery = query(inventoryCollection, where('clave', '==', normalizedMaterial.clave));
        const querySnapshot = await getDocs(materialQuery);

        if (querySnapshot.size > 0) {
          // Si el material ya existe, actualizar su cantidad
          const existingMaterialDoc = querySnapshot.docs[0];
          const existingMaterialData = existingMaterialDoc.data();
          const cantidadActual = existingMaterialData['cantidad'] || 0;

          await updateDoc(doc(this.firestore, 'Inventory', existingMaterialDoc.id), {
            cantidad: cantidadActual + normalizedMaterial.cantidad,
          });
          console.log(`Material actualizado: ${normalizedMaterial.nombre}`);
        } else {
          // Si no existe, agregar un nuevo documento
          const newMaterial = {
            nombre: normalizedMaterial.nombre,
            cantidad: normalizedMaterial.cantidad,
            atributos: {
              color: normalizedMaterial.color ? [normalizedMaterial.color] : [],
              tamaño: normalizedMaterial.tamaño ? [normalizedMaterial.tamaño] : [],
            },
            clave: normalizedMaterial.clave,
          };

          await addDoc(inventoryCollection, newMaterial);
          console.log(`Material agregado: ${normalizedMaterial.nombre}`);
        }
      }

      alert('Material(es) procesado(s) correctamente.');

      // Limpiar el formulario y asegurarse de que solo haya un material
      this.materialForm.reset();
      this.materiales.clear(); // Eliminar todos los materiales en el array
      this.materiales.push(this.createMaterial()); // Agregar un solo material vacío

    } catch (error) {
      console.error('Error al procesar el material:', error);
      alert('Ocurrió un error al procesar el material.');
    }
  }

  // Función para agregar un nuevo material al formulario (si es necesario)
  addMaterial() {
    this.materiales.push(this.createMaterial());
  }
}
