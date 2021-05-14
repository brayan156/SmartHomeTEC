import { TestBed } from '@angular/core/testing';

import { DbAPIService } from './db-api.service';

describe('DbAPIService', () => {
  let service: DbAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DbAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
