import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TiendaEnLineaComponent } from './tienda-en-linea.component';

describe('TiendaEnLineaComponent', () => {
  let component: TiendaEnLineaComponent;
  let fixture: ComponentFixture<TiendaEnLineaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TiendaEnLineaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TiendaEnLineaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
