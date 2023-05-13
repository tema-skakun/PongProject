import { Test, TestingModule } from '@nestjs/testing';
import { MatchHistoryController } from './match-history.controller';

describe('MatchHistoryController', () => {
  let controller: MatchHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchHistoryController],
    }).compile();

    controller = module.get<MatchHistoryController>(MatchHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
