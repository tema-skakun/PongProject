import { Controller, Get, HttpException, HttpStatus, Param, Res, Response } from '@nestjs/common';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryTransformed } from 'src/entities/matchHistoryEntry/matchHistoryEntry.transformed';
import { ObjectPruning } from 'src/tools/objectPruning';

@Controller('match-history')
export class MatchHistoryController {

	constructor(
		private matchHistoryService: MatchHistoryService
	) {}

	@Get('test')
	giveTest() {
		return 'hhhhheeey';
	}

	@Get(':id')
	async completeMatchHistory(@Param('id') intraId: number): Promise<MatchHistoryTransformed []> {
		try {
			const matchHistory = await this.matchHistoryService.get(intraId);
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
