import { TestBed } from '@angular/core/testing';

import { ChatSettingService } from './chat-setting.service';

describe('ChatSettingService', () => {
  let service: ChatSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
