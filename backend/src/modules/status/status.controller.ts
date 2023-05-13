import { Controller, Req, UseGuards } from '@nestjs/common';
import { ClientStatus, StatusService } from './status.service';
import { Get } from '@nestjs/common';
import JwtTwoFactorGuard from '../../GuardStrategies/Jwt2F.guard'
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { Repository } from 'typeorm';

@Controller('status')
export class StatusController {
	constructor(private statusService: StatusService,
		@InjectRepository(User) private userRep: Repository<User>) {}

	@Get('/')
	@UseGuards(JwtTwoFactorGuard)
	async getStatus(@Req() req: any): Promise< Object > {
		const requesterEntity: User = await this.userRep.findOne({
			where: {
				intra_id: req.user.intra_id
			},
			relations: ['friends']
		})
		const friends: Set<number> = new Set(requesterEntity.friends.map(friend => friend.intra_id));

		const filteredStatusMap: Map<number, ClientStatus> = new Map();
		const statusMap: Map<number, ClientStatus> =  await this.statusService.getStatus();
		// console.log(`This is my status Map size: ${statusMap.size}`);

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
