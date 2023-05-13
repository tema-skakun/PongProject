import { Controller, Delete, Get, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { Param } from '@nestjs/common';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { User } from 'src/entities';
import { ClientStatus, StatusService } from '../status/status.service';


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
	@UseGuards(JwtTwoFactorGuard)
	async deleteFriend(@Param('id') id: number, @Req() req: any): Promise<boolean> {
		return await this.friendsService.deleteFriend(req.user.intra_id, id);
	}


	@Post('/:id')
	@UseGuards(JwtTwoFactorGuard)
	async addFriend(@Param('id') id: number, @Req() req: any): Promise<User> {
		return await this.friendsService.addFriend(req.user.intra_id , id);
	}

	@Get('/displayable/:id')
	// @UseGuards(JwtTwoFactorGuard)
	async getDisplayables(@Param('id') id: number): Promise<FriendDto []> {
		const friendsEntity: User [] = await this.friendsService.getFriends(id);

		const friendsDto: FriendDto [] = await Promise.all(friendsEntity.map(async friend => {
			return await this.friendsService.entityToDisplayable(friend);
		}))
		return (friendsDto);
	}
	@Get('/displayable')
	@UseGuards(JwtTwoFactorGuard)
	async getDisplayablesAll(@Req() req: any): Promise<FriendDto []> {
		const friendsEntity: User [] = await this.friendsService.getFriends(req.user.intra_id);
		if (friendsEntity.length === 0)
			return [];
		const friendsDto: FriendDto [] = await Promise.all(friendsEntity.map(async friend => {
			return await this.friendsService.entityToDisplayable(friend);
		}))
		return (friendsDto);
	}
}
