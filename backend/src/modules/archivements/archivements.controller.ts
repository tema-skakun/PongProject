import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { User } from 'src/entities';
import { UserService } from '../user/user.service';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';

@Controller('archivements')
export class ArchivementsController {
	constructor(
		private usrService: UserService,
	) {}

	@Get('/:id')
	@UseGuards(JwtTwoFactorGuard)
	async getArchivements(@Param('id') intraId: string, @Req() req: any) {
		let chosenId: number = req.user.intra_id;

		if (intraId && !isNaN(Number(intraId))) {
			chosenId = Number(intraId);
		}

		const user: User = await this.usrService.findUserByIdAndGetRelated(chosenId, ['archivements']);
		return user.archivements;
	}

}
