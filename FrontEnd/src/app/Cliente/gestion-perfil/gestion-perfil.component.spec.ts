import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPerfilComponent } from './gestion-perfil.component';

describe('GestionPerfilComponent', () => {
  let component: GestionPerfilComponent;
  let fixture: ComponentFixture<GestionPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
