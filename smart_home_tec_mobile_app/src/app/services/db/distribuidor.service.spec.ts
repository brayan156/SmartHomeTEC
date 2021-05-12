import { TestBed } from '@angular/core/testing';

import { DistribuidorService } from './distribuidor.service';

describe('DistribuidorService', () => {
  let service: DistribuidorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DistribuidorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
