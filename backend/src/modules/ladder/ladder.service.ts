import { Get, Injectable } from '@nestjs/common';
import { MatchHistoryService } from '../game/match-history/match-history.service';
import { UserService } from '../user/user.service';

@Injectable()
export class LadderService {
	constructor(
		private matchHistoryService: MatchHistoryService,
	) {}

}
