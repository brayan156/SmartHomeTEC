import { TestBed } from '@angular/core/testing';

import { AposentoService } from './aposento.service';

describe('AposentoService', () => {
  let service: AposentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AposentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
