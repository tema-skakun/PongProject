import { Controller, Get, Param } from '@nestjs/common';
import { User } from 'src/entities';
import { UserService } from '../user/user.service';

@Controller('archivements')
export class ArchivementsController {
	constructor(
		private usrService: UserService,
	) {}

	@Get('/')
	test() {
		return "HEELLLo";
	}

	@Get('/:id')
	async getArchivements(@Param('id') intraId: number) {
		const user: User = await this.usrService.findUserByIdAndGetRelated(intraId, ['archivements']);
		return user.archivements;
	}

}
