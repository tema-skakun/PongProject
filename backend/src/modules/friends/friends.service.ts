import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { UserDto } from 'src/entities/user/user.dto';
import { Repository } from 'typeorm';
import { FriendDto } from './friends.controller';
import { StatusService } from '../status/status.service';
import { ClientStatus } from '../status/status.service';
import { clients } from '../game/game.gateway';

@Injectable()
export class FriendsService {

	constructor(
		private readonly statusService: StatusService,
		@InjectRepository(User) private userRepository: Repository<User>
	) { }

	private async initalUser(userId: number) {
		const initalUser: User = await this.userRepository.findOne({
			where: {
				intra_id: userId
			},
			relations: ['friends'] // If it is undefined will it update to be undefined.
		});
		return (initalUser);
	}

	async deleteFriend(userId: number, friend_id: number)
	{    
		const userWithFriend: User = await this.initalUser(userId);
		let success: boolean = false;

		userWithFriend.friends = userWithFriend.friends.map((friend) => {
			if (Number(friend.intra_id) === friend_id)
			{
				success = true;
				return ;
			}
			return friend;
		})
		await this.userRepository.save(userWithFriend);

		return success;
	}



	async addFriend(userId: number, friend_id: number): Promise<User> {
		const userWithoutFriend: User = await this.initalUser(userId);

		const friend: User = await this.userRepository.findOneBy({
			intra_id: friend_id
		})
	
		userWithoutFriend.friends.push(friend);
		return this.userRepository.save(userWithoutFriend);
	}

	async getFriends(userId: number): Promise<User []> {
		const user: User = await this.userRepository.findOne({
			where: {
			intra_id: userId
		},
		relations: ['friends']})

		return user.friends;
	}

	async entityToDisplayable(user: User): Promise<FriendDto> {
		const userStatus: Map<number, ClientStatus> = await this.statusService.getStatus();

		let friendStatus: string = 'No status set';
		if (userStatus.get(Number(user.intra_id)) === ClientStatus.OFFLINE)
			friendStatus = 'Offline';
		else if (userStatus.get(Number(user.intra_id)) === ClientStatus.CONNECTED)
			friendStatus = 'Connected';
		else if (userStatus.get(Number(user.intra_id)) === ClientStatus.INGAME)
			friendStatus = 'In game';

		return {
			name: user.username,
			id: user.intra_id,
			pictureUrl: user.picture_url,
			status: friendStatus
		}
	}
}
