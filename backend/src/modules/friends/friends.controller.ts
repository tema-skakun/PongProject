import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Param } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { User } from 'src/entities';
import { ClientStatus, StatusService } from '../status/status.service';
import { ObjectPruning } from 'src/tools/objectPruning';
import { UserTransformed } from 'src/entities/user/user.transformed';
import { ExistsGuardid } from 'src/GuardStrategies/UrlGuard';


export type FriendDto = {
	name: string;
	id: number;
	pictureUrl?: string;
	status: string;
};

@Controller('friends')
export class FriendsController {
	constructor(
		private readonly friendsService: FriendsService
	) {}

	@Delete('/:id')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async deleteFriend(@Param('id') id: string, @Req() req: any): Promise<boolean> {
		let chosenId: number = req.user.intra_id;

		if (id && !isNaN(Number(id))) {
			chosenId = Number(id);
		}
		return await this.friendsService.deleteFriend(req.user.intra_id, chosenId);
	}

	

	@Post('/:id')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async addFriend(@Param('id') id: string, @Req() req: any): Promise<UserTransformed> {
		let chosenId: number = req.user.intra_id;

		if (id && !isNaN(Number(id))) {
			chosenId = Number(id);
		}

		return ObjectPruning(UserTransformed, await this.friendsService.addFriend(req.user.intra_id , chosenId));
	}

	@Get('/displayable/:id?')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async getDisplayablesAll(@Req() req: any, @Param('id') id?: string): Promise<FriendDto []> {
		let chosenId: number = Number(req.user.intra_id);

		if (id && !isNaN(Number(id))) {
			chosenId = Number(id);
		}

		const friendsEntity: User [] = await this.friendsService.getFriends(chosenId);
		if (friendsEntity.length === 0)
			return [];
		const friendsDto: FriendDto [] = await Promise.all(friendsEntity.map(async friend => {
			return await this.friendsService.entityToDisplayable(friend);
		}))
		return (friendsDto);
	}
}
