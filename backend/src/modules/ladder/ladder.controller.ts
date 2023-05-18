import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LadderService } from './ladder.service';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { ExistsGuardid } from 'src/GuardStrategies/UrlGuard';

@Controller('ladder')
export class LadderController {
	constructor(
		private ladderService: LadderService,
		private usrService: UserService
	) {}

	@Get('/percentile/:id?')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async percentile(@Param('id') intraId: string, @Req() req: any): Promise<string | number> // if string then not ranked yet
	{
		let chosenId: number = req.user.intra_id;

		if (intraId && !isNaN(Number(intraId))) {
			chosenId = Number(intraId);
		}

		const winsToLosses: number [] = await this.usrService.getWinsToGamesArray();
		const myWinToLoss: number | string = await this.usrService.getWinsToLossesRatio(chosenId);
		if (typeof myWinToLoss === 'string')
		{
			return "not ranked yet";
		}

		const index: number = winsToLosses.indexOf(myWinToLoss);
		const myRank: number = (100 / (winsToLosses.length - 1)) * index;

		return myRank;
	}

	@Get('winsToLossesAll')
	@UseGuards(JwtTwoFactorGuard)
	async winsToLossesAll()
	{
		return this.usrService.getWinsToGamesArray(); 
	}

	@Get('ladder/:id')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async winsToLosses(@Param('id') intraId: string, @Req() req: any): Promise<number | string> // if string then not ranked yet
	{
		let chosenId: number = req.user.intra_id;

		if (intraId && !isNaN(Number(intraId))) {
			chosenId = Number(intraId);
		}

		return this.usrService.getWinsToLossesRatio(chosenId);
	}

}
