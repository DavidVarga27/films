import { TestBed } from '@angular/core/testing';

import { OmdbPosterService } from './omdb-poster.service';

describe('OmdbPosterService', () => {
  let service: OmdbPosterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OmdbPosterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
