import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChooseMenusPage } from './choose-menus.page';

describe('ChooseMenusPage', () => {
  let component: ChooseMenusPage;
  let fixture: ComponentFixture<ChooseMenusPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseMenusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
