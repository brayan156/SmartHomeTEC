import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ControlDispositivosActivosPage } from './control-dispositivos-activos.page';

describe('ControlDispositivosActivosPage', () => {
  let component: ControlDispositivosActivosPage;
  let fixture: ComponentFixture<ControlDispositivosActivosPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlDispositivosActivosPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ControlDispositivosActivosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
