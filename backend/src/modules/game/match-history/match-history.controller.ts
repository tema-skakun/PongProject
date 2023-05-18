import { Controller, Get, HttpException, HttpStatus, Param, Req, Res, Response, UseGuards } from '@nestjs/common';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryTransformed } from 'src/entities/matchHistoryEntry/matchHistoryEntry.transformed';
import { ObjectPruning } from 'src/tools/objectPruning';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { ExistsGuardid } from 'src/GuardStrategies/UrlGuard';

@Controller('match-history')
export class MatchHistoryController {

	constructor(
		private matchHistoryService: MatchHistoryService
	) {}

	@Get('/:id?')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async completeMatchHistory(@Req() req: any, @Param('id') id?: string): Promise<MatchHistoryTransformed []> {
		let chosenId: number = req.user.intra_id;

		if (id && !isNaN(Number(id))) {
			chosenId = Number(id);
		}
		
		try {
			const matchHistory = await this.matchHistoryService.get(chosenId);

			const matchHistroyTransformed: MatchHistoryTransformed [] = [];
			for (const historyEntry of matchHistory)
			{
				matchHistroyTransformed.push(ObjectPruning<MatchHistoryTransformed>(MatchHistoryTransformed, historyEntry));
			}
			return matchHistroyTransformed;
		} catch (err: any) {
			throw  new HttpException('Intra id does not exist', HttpStatus.FOUND);
		}
	}
}
