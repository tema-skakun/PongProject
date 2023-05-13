import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { LadderService } from './ladder.service';

@Controller('ladder')
export class LadderController {
	constructor(
		private ladderService: LadderService,
		private usrService: UserService
	) {}

	@Get('/percentile/:id')
	async percentile(@Param('id') intraId: number): Promise<string | number> // if string then not ranked yet
	{
		const winsToLosses: number [] = await this.usrService.getWinsToLossesArray();
		const myWinToLoss: number | string = await this.usrService.getWinsToLossesRatio(intraId);
		if (typeof myWinToLoss === 'string')
		{
			return "not ranked yet";
		}

		const index: number = winsToLosses.indexOf(myWinToLoss);
		console.log(winsToLosses.length);
		console.log(index);
		console.log(index / winsToLosses.length);

		return (index / winsToLosses.length) * 100;
	}

	@Get('winsToLossesAll')
	async winsToLossesAll()
	{
		return this.usrService.getWinsToLossesArray(); 
	}

	@Get('/:id')
	async winsToLosses(@Param('id') intraId: number): Promise<number | string> // if string then not ranked yet
	{
		return this.usrService.getWinsToLossesRatio(intraId);
	}

}
