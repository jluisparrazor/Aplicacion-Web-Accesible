import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeticionesMaterialPage } from './peticiones-material.page';

describe('PeticionesMaterialPage', () => {
  let component: PeticionesMaterialPage;
  let fixture: ComponentFixture<PeticionesMaterialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PeticionesMaterialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
