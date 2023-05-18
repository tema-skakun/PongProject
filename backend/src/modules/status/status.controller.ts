import { Controller, HttpException, Param, Req, Res, UseGuards } from '@nestjs/common';
import { ClientStatus, StatusService } from './status.service';
import { Get } from '@nestjs/common';
import JwtTwoFactorGuard from '../../GuardStrategies/Jwt2F.guard'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';
import { ExistsGuardid } from 'src/GuardStrategies/UrlGuard';

@Controller('status')
export class StatusController {
	constructor(private statusService: StatusService,
		@InjectRepository(User) private userRep: Repository<User>) {}

	@Get('/self')
	@UseGuards(JwtTwoFactorGuard)
	async getOwnStatus(@Req() req: any) {

		const statusMap: Map<number, ClientStatus> =  await this.statusService.getStatus();
		return statusMap.get(Number(req.user.intra_id));
	}

	@Get('ws/:ws_id')
	@UseGuards(JwtTwoFactorGuard)
	wsStatus(@Param('ws_id') ws_id: string)
	{
		return this.statusService.getWsStatus(ws_id);
	}
	
	@Get('status/:id?')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async getStatus(@Req() req: any, @Param() id: number): Promise< Object > {
		let chosenId: number = req.user.intra_id;

		if (id && !isNaN(Number(id))) {
			chosenId = Number(id);
		}

		const requesterEntity: User = await this.userRep.findOne({
			where: {
				intra_id: chosenId
			},
			relations: ['friends']
		})
		const friends: Set<number> = new Set(requesterEntity.friends.map(friend => friend.intra_id));

		const filteredStatusMap: Map<number, ClientStatus> = new Map();
		const statusMap: Map<number, ClientStatus> =  await this.statusService.getStatus();

		statusMap.forEach((stat, id) => {
			friends.forEach((intraId) => { // For some reason type checking is false!
				if (id == intraId)
					filteredStatusMap.set(id, stat);
			})
		})

		const retObj: Object = {};
		filteredStatusMap.forEach((stat, key) => {
			retObj[key] = stat;
		})
		return retObj;
	}
	
}
