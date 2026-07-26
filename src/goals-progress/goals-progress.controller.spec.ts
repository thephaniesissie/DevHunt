import { Test, TestingModule } from '@nestjs/testing';
import { GoalsProgressController } from './goals-progress.controller';
import { GoalsProgressService } from './goals-progress.service';

describe('GoalsProgressController', () => {
  let controller: GoalsProgressController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GoalsProgressController],
      providers: [GoalsProgressService],
    }).compile();

    controller = module.get<GoalsProgressController>(GoalsProgressController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
