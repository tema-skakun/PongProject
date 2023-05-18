import { ForbiddenException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserDto } from '../../entities/user/user.dto';
import { User } from "../../entities/user/user.entity";
import { JsonContains, Repository } from "typeorm";
import { MatchHistoryEntry } from "src/entities/matchHistoryEntry/matchHistoryEntry.entity";

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private readonly userRepository: Repository<User>,
		) {}

	async userExists(intra_id: number): Promise<boolean>
	{
		try {
			const user = await this.userRepository.findOneBy({
				intra_id: intra_id
			})
			if (user === null)
				return false;
			
			return true;
		} catch (err: unknown)
		{
			return false;
		}
	}

	createUser(authDto: UserDto) {
		const newUser = this.userRepository.create(authDto);
		return this.userRepository.save(newUser);
	}

	async findBefrienders(intra_id: number) {
		const befrienders = await this.userRepository.createQueryBuilder('user')
			.innerJoin('user.friends', 'friend', 'friend.intra_id = :intra_id', { intra_id })
			.getMany();
		return new Set(befrienders.map(befriender => Number(befriender.intra_id) ));
	}

	async getnotBlockedUsers(intra_id: number) {
		const allUsers = await this.userRepository.find({
			relations: ['blockedUsers'],
		});
		const user1 = await this.userRepository.findOne({
			where: {
				intra_id: intra_id
			},
			relations: ['blockedUsers'],
		});
		const notBlockedUsers: User[] = [];
		for (const user of allUsers) {
			if (user.intra_id === intra_id) {
				continue;
			}
			if (user1.blockedUsers.some((blockedUser) => blockedUser.intra_id === user.intra_id)) {
				continue;
			}
			if (user.blockedUsers.some((blockedUser) => blockedUser.intra_id === intra_id)) {
			continue;
			}
			notBlockedUsers.push(user);
		}
		return notBlockedUsers;
	}

	async isBlocked(intra_id: number, userIdToCheck: number) {
		const user = await this.userRepository.findOne({
			where: {
			  intra_id: intra_id
			},
			relations: ['blockedBy'],
		  });
		  if (!user) {
			throw new Error('user doesnt exist');
		  }
		  const blockingUser = await this.userRepository.findOne({
			where: {
			  intra_id: userIdToCheck
			},
			relations: ['blockedBy']
		  });
		  if (!blockingUser) {
			throw new Error('Blocking user not found');
		  }
		  return user.blockedBy.some((blockedUser) => blockedUser.intra_id === userIdToCheck) ||
			blockingUser.blockedBy.some((blockedUser) => blockedUser.intra_id === intra_id);
	}

	getUsers() {
		return this.userRepository.find();
	}

	findUniqueByEmail(email: string) {
		return this.userRepository.findOneBy({
			email: email,
		});
	}

	findUniqueByusername(username: string) {
		return this.userRepository.findOneBy({
			username: username,
		});
	}

	findUsersById(id: number) {
		return this.userRepository.findOneBy({
			intra_id: id,
		});
	}
	
	findUserByIdAndGetRelated(id:number, nameOfRelated: string []) {
		return this.userRepository.findOne({
			where: {
				intra_id: id
			},
			relations: nameOfRelated
		});
	}

	async updatePic(userid: number, newPicUrl: string) {

		await this.userRepository.update({
			intra_id: userid, },  {
			picture_url: newPicUrl,
		});
		
	}

	async updateUsername(userid: number, newUsername: string) {

		try {
			await this.userRepository.update({
				intra_id: userid, },   {
					username: newUsername,
				});
			return newUsername
		} catch {
			throw new ForbiddenException('Username already exists');
		}
	}

	async deleteuser(id: number) {
		this.userRepository.delete({
			intra_id: id,
		})
	}

	async validateUser(user: any): Promise<User> {
		const usr = await this.userRepository.findOneBy({
			email: user.email,
			intra_id: user.id,
			accessToken: user.token,
		})
		return usr;
	}

	async setTwoFactorAuthenticationSecret(secret: string, userid: number) {
		return await this.userRepository.update({
			intra_id: userid, }, {
		  	twoFactorAuthenticationSecret: secret,
		});
	}

	async turnOnTwoFactorAuthentication(intra_id: number) {
		return this.userRepository.update(intra_id, {
		  isTwoFactorAuthenticationEnabled: true
		});
	}

	async turnOffTwoFactorAuthentication(intra_id: number) {
		return this.userRepository.update(intra_id, {
		  isTwoFactorAuthenticationEnabled: false
		});
	}

	incr_totalWins(usrEntity: User) {
		if (!usrEntity.total_wins)
			usrEntity.total_wins = 0;

		++usrEntity.total_wins;
		return this.userRepository.update(usrEntity.intra_id, {
			total_wins: usrEntity.total_wins
		})
	}

	incr_totalLosses(usrEntity: User) {
		if (!usrEntity.total_losses)
			usrEntity.total_losses = 0;

		++usrEntity.total_losses;
		return this.userRepository.update(usrEntity.intra_id, {
			total_losses: usrEntity.total_losses
		})
	}

	async getWinsToLossesRatio(intra_id: number): Promise<number | string> {
		const usr: User = await this.userRepository.findOneBy({
			intra_id: intra_id
		})
		if (usr.total_losses === 0 && usr.total_wins === 0)
			return 'not ranked yet'

		return (usr.total_wins / (usr.total_losses + usr.total_wins))
	}

	async getWinsToGamesArray(): Promise<number []> {
		const usr: User [] = await this.userRepository.find();

		const ratio_arr: number [] = [];
		for (const usrEntity of usr) {
			ratio_arr.push(usrEntity.total_wins / (usrEntity.total_losses + usrEntity.total_wins));
		}
		
		ratio_arr.sort();
		return ratio_arr;
	}

	async findUserChannels(intra_id: number) {
		const user = await this.userRepository.findOne({
			where: { intra_id },
			relations: ['channels']
		  });
		return user.channels;
	}

	async blockUser(intra_id: number, receiverId: number) {
		const user = await this.userRepository.findOne({ 
			where: {
				intra_id: intra_id,
			},
			relations: ['blockedBy'],
		});
		const blocker = await this.userRepository.findOne({ 
			where: {
				intra_id: receiverId,
			},
			relations: ['blockedBy'],
		});
		if (!user || !blocker) {
			throw new Error('User or blocker not found');
		}
		const blocked = await this.isBlocked(user.intra_id, blocker.intra_id);
		if (blocked) {
			throw new Error('User already blocked');
		}
		user.blockedBy = user.blockedBy || [];
		user.blockedBy.push(blocker);
		await this.userRepository.save(user);
	}

	async unblockUser(intra_id: number, receiverId: number) {
		const user = await this.userRepository.findOne({ 
			where: {
				intra_id: intra_id,
			},
			relations: ['blockedBy'],
		});
		const blocker = await this.userRepository.findOne({ 
			where: {
				intra_id: receiverId,
			},
			relations: ['blockedBy'],
		});
		if (!user || !blocker) {
			throw new Error('User or unblocker not found');
		}
		const blocked = await this.isBlocked(user.intra_id, blocker.intra_id);
		if (!blocked) {
			throw new Error('User not blocked');
		}
		user.blockedBy = user.blockedBy || [];
		user.blockedBy = user.blockedBy.filter((u) => u.intra_id !== blocker.intra_id);
		await this.userRepository.save(user);
	}

	async findUserWithBanned(intra_id: number) {
		return await this.userRepository.findOne({
			where: {
			  intra_id: intra_id,
			},
			relations: ['bannedFromChannels'],
		  });
	}

	async isAmember(intra_id: number, channelId: number) {
		const user = await this.userRepository.findOne({
			where: {
			  intra_id: intra_id,
			},
			relations: ['channels'],
		  });

		if (!user) {
			throw new Error('user not existing');
		}
		return user.channels.some((channel) => channel.id === channelId);
	}
}
