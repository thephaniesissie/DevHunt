import { Test, TestingModule } from '@nestjs/testing';
import { GoalsProgressService } from './goals-progress.service';

describe('GoalsProgressService', () => {
  let service: GoalsProgressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GoalsProgressService],
    }).compile();

    service = module.get<GoalsProgressService>(GoalsProgressService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
