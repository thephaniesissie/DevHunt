import { Test, TestingModule } from '@nestjs/testing';
import { BadgeEarnedService } from './badge_earned.service';

describe('BadgeEarnedService', () => {
  let service: BadgeEarnedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BadgeEarnedService],
    }).compile();

    service = module.get<BadgeEarnedService>(BadgeEarnedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
