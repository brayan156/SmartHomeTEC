import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionDistribuidoresComponent } from './gestion-distribuidores.component';

describe('GestionDistribuidoresComponent', () => {
  let component: GestionDistribuidoresComponent;
  let fixture: ComponentFixture<GestionDistribuidoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionDistribuidoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionDistribuidoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
