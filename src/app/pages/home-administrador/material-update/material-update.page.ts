import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaterialService } from '../../../common/services/material-update.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MaterialI } from '../../../common/models/material.models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-material-update',
  templateUrl: './material-update.page.html',
  styleUrls: ['./material-update.page.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class MaterialUpdatePage implements OnInit {
  materialForm: FormGroup;
  inventory: any[] = [];
  inventoryNames: string[] = [];
  isToggleOpen = false;

  constructor(private fb: FormBuilder, private materialService: MaterialService,     private readonly router: Router,
  ) {}

  ngOnInit() {
    this.materialForm = this.fb.group({
      materiales: this.fb.array([this.createMaterial()]),
    });

    this.loadInventory();
  }

  async loadInventory() {
    try {
      this.inventory = await this.materialService.fetchInventory();
      this.inventoryNames = await this.materialService.fetchInventoryNames();
      console.log('Inventario cargado correctamente:', this.inventory);
    } catch (error) {
      console.error('Error al cargar el inventario:', error);
    }
  }

  createMaterial(): FormGroup {
    return this.fb.group({
      nombre: [null, Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      color: [''],
      tamano: [''],
    });
  }

  get materiales(): FormArray {
    return this.materialForm.get('materiales') as FormArray;
  }

  addMaterial() {
    this.materiales.push(this.createMaterial());
  }

  async submitMaterials() {
    if (this.materialForm.invalid) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }

    try {
      const materiales = this.materialForm.value.materiales;

      const materialesProcesados: MaterialI[] = materiales.map((material: any) => {
        const normalizedMaterial = {
          ...material,
          clave: this.materialService.generateKey(material),
        };
        return normalizedMaterial;
      });

      await this.materialService.saveMaterials(materialesProcesados);
      alert('Material(es) procesado(s) correctamente.');

      // Limpieza del formulario
      this.materialForm.reset();
      this.materiales.clear();
      this.materiales.push(this.createMaterial());

      // Volver a cargar el inventario actualizado
      await this.loadInventory();
    } catch (error) {
      console.error('Error al procesar los materiales:', error);
      alert('Ocurrió un error al procesar los materiales.');
    }
  }

  comeback(){
    this.router.navigate(['/homeadministrador']);
  }
}
