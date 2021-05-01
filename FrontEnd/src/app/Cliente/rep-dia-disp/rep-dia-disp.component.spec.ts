import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepDiaDispComponent } from './rep-dia-disp.component';

describe('RepDiaDispComponent', () => {
  let component: RepDiaDispComponent;
  let fixture: ComponentFixture<RepDiaDispComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepDiaDispComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepDiaDispComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
