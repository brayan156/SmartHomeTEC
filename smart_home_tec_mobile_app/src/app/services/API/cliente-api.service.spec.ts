import { TestBed } from '@angular/core/testing';

import { ClienteAPIService } from './cliente-api.service';

describe('ClienteAPIService', () => {
  let service: ClienteAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClienteAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
