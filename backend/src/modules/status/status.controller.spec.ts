import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { Repository } from 'typeorm';
import { User } from 'src/entities';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockStatusService = () => ({
	getStatus: jest.fn(),
});

const mockUserRepository = () => ({
	findOne: jest.fn(),
});

describe('StatusController', () => {
	let statusController: StatusController;
	let statusService: StatusService;
	let userRep: Repository<User>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [StatusController],
			providers: [
				StatusService,
				{
					provide: getRepositoryToken(User),
					useFactory: mockUserRepository
				},
				{
					provide: StatusService,
					useFactory: mockStatusService
				}
			]
		}).compile();

		statusController = module.get<StatusController>(StatusController);
		statusService = module.get<StatusService>(StatusService);
		userRep = module.get<Repository<User> >(getRepositoryToken(User));

		it('should be defined', () =>  {
			expect(statusController).toBeDefined();
		})

		describe('getStatus', () => {
			it('should return filtered status map', async () => {
				const req = {}
			})
		})

	});
});
