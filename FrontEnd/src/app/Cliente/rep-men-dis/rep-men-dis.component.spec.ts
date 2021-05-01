import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepMenDisComponent } from './rep-men-dis.component';

describe('RepMenDisComponent', () => {
  let component: RepMenDisComponent;
  let fixture: ComponentFixture<RepMenDisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepMenDisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepMenDisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
