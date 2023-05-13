import { Controller, Get, HttpException, HttpStatus, Param, Req, Res, Response, UseGuards } from '@nestjs/common';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryTransformed } from 'src/entities/matchHistoryEntry/matchHistoryEntry.transformed';
import { ObjectPruning } from 'src/tools/objectPruning';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';

@Controller('match-history')
export class MatchHistoryController {

	constructor(
		private matchHistoryService: MatchHistoryService
	) {}

	@Get('test')
	giveTest() {
		return 'hhhhheeey';
	}

	@Get('/')
	@UseGuards(JwtTwoFactorGuard)
	async completeMatchHistory(@Req() req: any): Promise<MatchHistoryTransformed []> {
		try {
			const matchHistory = await this.matchHistoryService.get(req.user.intra_id);

			const matchHistroyTransformed: MatchHistoryTransformed [] = [];
			for (const historyEntry of matchHistory)
			{
				matchHistroyTransformed.push(ObjectPruning<MatchHistoryTransformed>(MatchHistoryTransformed, historyEntry));
			}
			return matchHistroyTransformed;
		} catch (err: any) {
			throw  new HttpException('internal Server errrrrror', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
