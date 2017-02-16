/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UpdatrLinkService } from './updatr-link.service';

describe('UpdatrLinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UpdatrLinkService]
    });
  });

  it('should ...', inject([UpdatrLinkService], (service: UpdatrLinkService) => {
    expect(service).toBeTruthy();
  }));
});
