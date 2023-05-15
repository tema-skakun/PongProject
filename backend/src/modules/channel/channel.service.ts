import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities";
import { dmChannelDto } from "src/entities/channel/dmchannel.dto";
import { Channel } from "src/entities/channel/channel.entity";
import { In, Repository } from "typeorm";
import { ChannelDto } from "src/entities/channel/channel.dto";
import { use } from "passport";
import { encodePassword } from "src/tools/bcrypt";


@Injectable()
export class ChannelService {
	constructor(
		@InjectRepository(Channel) private readonly channelRepository: Repository<Channel>,
		) {}

	async createDmChannel(dmchannelDto: dmChannelDto) {
		const newChannel = this.channelRepository.create(dmchannelDto);
		return await this.channelRepository.save(newChannel);
	}

	async createChannel(channelDto: ChannelDto) {
		const newChannel = await this.channelRepository.create(channelDto);
		return await this.channelRepository.save(newChannel);
	}

	async getChannels() {
		return await this.channelRepository.find();
	}

	async findUserChannels(intra_id: number) {
		return await this.channelRepository.find({
			where: { users: { intra_id } },
			order: {
				updated_at: 'DESC'
			}
		});
	}

	async findChannelById(id: number) {
		return await this.channelRepository.findOneBy({
			id: id,
		});
	}

	async findChannelUsers(id: number) {
		const channnelUsers = await this.channelRepository.findOne({ 
			where: { id },
			relations: ['users']
		});
		return channnelUsers.users;
	}

	async findChannelByIdWithUsers(id: number) {
		const channnel = await this.channelRepository.findOne({ 
			where: { id },
			relations: ['users']
		});
		return channnel;
	}

	async addUserToChannel(channel: Channel, user: User): Promise<Channel> {
		channel.users.push(user);
		return this.channelRepository.save(channel);
	}

	async findChannelsUserCanJoin(user: User) {
		const channels = await this.channelRepository.find({
			relations: ['users', 'invited', 'bannedUsers']
		});
		const joinableChannels: Channel[] = [];

		for (const channel of channels) {
			if (channel.isDM) {
				continue;
			}
			if (channel.isPrivate) {
			  const isInvited = channel.invited?.some(invitedUser => invitedUser.intra_id === user.intra_id);
			  if (!isInvited) {
				continue;
			  }
			}
			const usr = channel.users?.some(channelUser => channelUser.intra_id === user.intra_id);
			if (usr) {
				continue;
			}
			const banned = channel.bannedUsers?.some(bannedUser => bannedUser.intra_id === user.intra_id);
			if (banned) {
				continue;
			}
			joinableChannels.push(channel);
		}
		return joinableChannels;
	}

	async isInvited(channelId: number, user: User) {
		const channel = await this.channelRepository.findOne({ 
			where: { id: channelId },
			relations: ['invited'],
		});
		return channel.invited?.some(invitedUser => invitedUser.intra_id === user.intra_id) ?? false;
	}

	async isBanned(channelId: number, user: User) {
		const channel = await this.channelRepository.findOne({ 
			where: { id: channelId },
			relations: ['bannedUsers'],
		});
		return channel.bannedUsers?.some(bannedUser => bannedUser.intra_id === user.intra_id) ?? false;
	}

	async isDMChannel(user1: User, user2: User): Promise<Channel> {
		const channels = await this.channelRepository.find({
		  where: {
			isDM: true,
		  },
		  relations: ['users'],
		});
	  
		for (const channel of channels) {
		  const channelUsers = channel.users || [];
		  if (
			channelUsers.some((channelUser) => channelUser.intra_id === user1.intra_id) &&
			channelUsers.some((channelUser) => channelUser.intra_id === user2.intra_id)
		  ) {
			return channel;
		  }
		}
	  
		return null;
	}

	async leaveChannel(intra_id: number, channelId: number) {
		const channel = await this.channelRepository.findOne({
			where: {
				id: channelId,
			},
			relations: ['users', 'administrators', 'owner'],
		})
		if (!channel) {
			throw new Error('Channel not found');
		}
		if (channel.isDM) {
			throw new Error('You cant leave private chat');
		}
		channel.users = channel.users.filter((u) => u.intra_id !== intra_id);
		channel.administrators = channel.administrators.filter((u) => u.intra_id !== intra_id);
		if (channel.owner && channel.owner.intra_id === intra_id){
			channel.owner = null;
		}
		await this.channelRepository.save(channel);
	}

	async isAdmin(intra_id: number, channelId: number) {
		const channel = await this.channelRepository.findOne({
			where: {
				id: channelId,
			},
			relations: ['administrators'],
		})
		if (!channel) {
			throw new Error('Channel not found');
		}
		if (channel.isDM) {
			throw new Error('It is private chat');
		}
		const isAdmin = channel.administrators?.some(admin => admin.intra_id === intra_id);
    	return isAdmin ? true : false;
	}

	async isOwner(intra_id: number, channelId: number) {
		const channel = await this.channelRepository.findOne({
			where: {
			  id: channelId,
			},
			relations: ['owner'],
		  });
		
		if (!channel) {
			throw new Error('Channel not found');
		}
		if (channel.isDM) {
			throw new Error('It is private chat');
		}
		if (!channel.owner) {
		return false;
		}
		
		return channel.owner.intra_id === intra_id;
	}

	async addAdminToChannel(user: User, channelId: number): Promise<void> {
		const channel = await this.channelRepository.findOne({
		  where: {
			id: channelId,
		  },
		  relations: ['administrators'],
		});
	  
		if (!channel) {
		  throw new Error(`Channel does not exist`);
		}
		const isAdmin = channel.administrators.some(admin => admin.intra_id === user.intra_id);
		if (isAdmin) {
		  throw new Error(`User is already an administrator of channel`);
		}
	  
		channel.administrators.push(user);
	  
		await this.channelRepository.save(channel);
	}

	async kickUser(intra_id: number, channelId: number) {
		const channel = await this.channelRepository.findOne({
			where: {
				id: channelId,
			},
			relations: ['users', 'administrators'],
		})
		if (!channel) {
			throw new Error('Channel not found');
		}
		if (channel.isDM) {
			throw new Error('You cant kick from private chat');
		}
		channel.users = channel.users.filter((u) => u.intra_id !== intra_id);
		channel.administrators = channel.administrators.filter((u) => u.intra_id !== intra_id);

		await this.channelRepository.save(channel);
	}

	async banUser(user: User, channelId: number): Promise<void> {
		const channel = await this.channelRepository.findOne({
		  where: {
			id: channelId,
		  },
		  relations: ['bannedUsers'],
		});
	  
		if (!channel) {
		  throw new Error(`Channel does not exist`);
		}
		if (channel.bannedUsers) {
			const isBanned = channel.bannedUsers.some(banned => banned.intra_id === user.intra_id);
			if (isBanned) {
				throw new Error(`User is already banned`);
			}
			channel.bannedUsers.push(user);
		}
		else {
			channel.bannedUsers = [user];
		}
		await this.channelRepository.save(channel);
	}

	async usersToInvite(users: User[], channelId: number) {
		const channel = await this.channelRepository.findOne({
			where: {
			  id: channelId,
			},
			relations: ['bannedUsers', 'invited', 'users'],
		  });
		if (!channel) {
			throw new Error('No such channel');
		}
		if (channel.isDM) {
			throw new Error('Cant invite to private chat');
		}
		if (!channel.isPrivate) {
			throw new Error('Can invite only to private channel');
		}
		const invitableUsers: User[] = [];
		for (const user of users) {
			const isInvited = channel.invited?.some(invitedUser => invitedUser.intra_id === user.intra_id);
			if (isInvited) {
				continue;
			}
			
			const usr = channel.users?.some(channelUser => channelUser.intra_id === user.intra_id);
			if (usr) {
				continue;
			}
			const banned = channel.bannedUsers?.some(bannedUser => bannedUser.intra_id === user.intra_id);
			if (banned) {
				continue;
			}

			invitableUsers.push(user);
		}
		return invitableUsers;
	}

	async inviteUserToChannel(channelId: number, user: User) {
		const channel = await this.channelRepository.findOne({
			where: {
			  id: channelId,
			},
			relations: ['invited'],
		});
		if (!channel) {
			throw new Error(`Channel does not exist`);
		}

		if (channel.invited) {
			const isInvited = channel.invited.some(invited => invited.intra_id === user.intra_id);
			if (isInvited) {
				throw new Error(`User is already invited`);
			}
			channel.invited.push(user);
		}
		else {
			channel.invited = [user];
		}
		await this.channelRepository.save(channel);
	}

	async changePassword(channelId: number, pass: string) {
		const channel = await this.channelRepository.findOne({
			where: {
			  id: channelId,
			},
		});
		if (!pass) {
			channel.password = null;
		} else {
			channel.password = encodePassword(pass);
		}
		await this.channelRepository.save(channel);
	}
}