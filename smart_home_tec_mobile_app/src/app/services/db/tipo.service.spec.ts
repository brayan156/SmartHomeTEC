import { TestBed } from '@angular/core/testing';

import { tipoService } from './tipo.service';

describe('tipoService', () => {
  let service: tipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(tipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
