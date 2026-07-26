import { Test, TestingModule } from '@nestjs/testing';
import { BadgeEarnedController } from './badge_earned.controller';
import { BadgeEarnedService } from './badge_earned.service';

describe('BadgeEarnedController', () => {
  let controller: BadgeEarnedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BadgeEarnedController],
      providers: [BadgeEarnedService],
    }).compile();

    controller = module.get<BadgeEarnedController>(BadgeEarnedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
