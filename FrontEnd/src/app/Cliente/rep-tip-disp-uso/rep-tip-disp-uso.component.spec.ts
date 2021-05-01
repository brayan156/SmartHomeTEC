import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepTipDispUsoComponent } from './rep-tip-disp-uso.component';

describe('RepTipDispUsoComponent', () => {
  let component: RepTipDispUsoComponent;
  let fixture: ComponentFixture<RepTipDispUsoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepTipDispUsoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepTipDispUsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
