import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { UserService } from "../user/user.service";
import { ChannelService } from "../channel/channel.service";
import { MessageService } from "../message/message.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { type } from "os";
import { string } from "mathjs";
import { Channel } from "src/entities/channel/channel.entity";
import { use } from "passport";
import { ForbiddenException } from "@nestjs/common";
import { comparePassword, encodePassword } from "src/tools/bcrypt";
import { channel } from "diagnostics_channel";
import { User } from "src/entities";
import { ObjectPruning } from "src/tools/objectPruning";
import { MessageTransformed } from "src/entities/message/message.transformed";


@WebSocketGateway({
	cors: {
		origin: true,
	},
	namespace: '/chat'
})
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	@WebSocketServer() server: Server;
	private socketToChannels = new Map<string, string[]>();
	private socket_idToSocket = new Map<string, Socket>();
	private socket_idToIntra_id = new Map<string, number>();
	private muted = new Map<number, number[]>();
	
	constructor(
		private userservice: UserService,
		private channelservice: ChannelService,
		private messageservice: MessageService,
		private readonly jwtservice: JwtService,
		private readonly configservice: ConfigService,
	) {}
	
	async afterInit() {
	}
	  
	async handleConnection(socket: Socket) {
		const accessToken = String(socket.handshake.query.accessToken);
		const secret = { secret: this.configservice.get('JWT_SECRET_KEY') };
		const usr = await this.jwtservice.verify(accessToken, secret);
		const user = await this.userservice.findUsersById(usr.intra_id);
		if (!user || !usr) {
			socket.disconnect();
			return ;
		}

		this.socket_idToSocket.set(socket.id, socket);
		this.socket_idToIntra_id.set(socket.id, user.intra_id);
		const userChannels = await this.channelservice.findUserChannels(user.intra_id);
		const channelIds = userChannels.map(channel => {
			socket.join(String(channel.id));
			return String(channel.id);
		  });
		await Promise.all(channelIds);
		this.socketToChannels.set(socket.id, channelIds);
 
	}

	async handleDisconnect(socket: Socket) {
		const channels = this.socketToChannels.get(socket.id) || [];
		channels.forEach((channelId) => {
			socket.leave(channelId);
		});
		this.socketToChannels.delete(socket.id);
		this.socket_idToSocket.delete(socket.id);
		this.socket_idToIntra_id.delete(socket.id);

		socket.disconnect();

	}

	@SubscribeMessage('sendMessage')
	async handleMessage(@MessageBody() data: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(senderId);
			const channel = await this.channelservice.findChannelByIdWithUsers(data.channelId);
			const mutedUsers = this.muted.get(channel.id);
			if (mutedUsers) {
				const isHere = mutedUsers.some(u => u === user.intra_id)
				if (isHere){
					throw new Error('You are muted');
				}
			}
			if (channel.isDM) {
				const otherUser = channel.users.find(otheruser => otheruser.intra_id !== user.intra_id);
				const blocked = await this.userservice.isBlocked(user.intra_id, otherUser.intra_id);
				if (blocked) {
					throw new ForbiddenException('One of you is blocked');
				}
			}
			if (await this.channelservice.isBanned(channel.id, user)) {
				throw new ForbiddenException('You are banned');
			}
			const message = {
				text: data.text,
				sender: user,
				channel: channel,
			}

			const newMessage = await this.messageservice.createMessage(message);
			this.server.to('' + channel.id).emit('getMessage', ObjectPruning(MessageTransformed, newMessage));
			return ;
		} catch(err) {
			return(err.message);
		}
	};

	@SubscribeMessage('createChannel')
	async addChannel(@MessageBody() channel: any, @ConnectedSocket() socket: Socket) {
		try {
			const intra_id = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(intra_id);
			const notBannedUsers = await this.userservice.getnotBlockedUsers(user.intra_id);
			const members = [];
			members.push(user);
			for (const userId of channel.usersId) {
				const user = await this.userservice.findUsersById(userId);
				const notBanned = notBannedUsers.some(notbanned => notbanned.intra_id === user.intra_id)
				if (user && notBanned) {
				  members.push(user);
				}
			}
			if (channel.name.length === 0 || (channel.type !== 'private' && channel.type !== 'public' && channel.type !== 'protected'))
				throw new ForbiddenException('you did something wrong');
			let password = channel.password;
			if(password.length !== 0) {
      			password = encodePassword(password);
			}
			const newChannel = {
				name: channel.name,
				isDM: false,
				isPrivate: channel.type === 'private' ? true : false,
				password: channel.type === 'protected' ? password : null,
				owner: user,
				users: members,
				administrators: [user],
				bannedUsers: [],
			}
			const Channel = await this.channelservice.createChannel(newChannel);
			const channelUsers = await this.channelservice.findChannelUsers(Channel.id);
			channelUsers.map(user => {
				const socket_id = this.getSocketIdFromIntraId(user.intra_id);
				if (socket_id) {
					const channels = this.socketToChannels.get(socket_id) || [];
					const sock = this.socket_idToSocket.get(socket_id);
					channels.push('' + Channel.id);
					sock.join('' + Channel.id);
				}
			})
			socket.to('' + Channel.id).emit('updateChannels', '');
			this.server.to(socket.id).emit('updateChannels', Channel.id);
		}catch(err) {
			if (err.code === '23505')
				return ('Channel name already exist');
			else
				return(err.message);
		}

	}

	@SubscribeMessage('joinChannel')
	async joinChannel(@MessageBody() channelInfo: any, @ConnectedSocket() socket: Socket) {
		try {
			const channel = await this.channelservice.findChannelByIdWithUsers(channelInfo.channelId);
			if (!channel)
				throw new ForbiddenException('No such channel');
			if (channel.password && !comparePassword(channelInfo.password, channel.password))
				throw new ForbiddenException('Wrong password');
			const intra_id = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(intra_id);
			if (channel.isPrivate && !this.channelservice.isInvited(channel.id, user)) {
				throw new ForbiddenException('You are not invited');
			}
			if (await this.channelservice.isBanned(channel.id, user)) {
				throw new ForbiddenException('You are banned from the channel');
			}
			await this.channelservice.addUserToChannel(channel, user);
			const channels = this.socketToChannels.get(socket.id) || [];
			channels.push('' + channel.id);
			socket.join('' + channel.id);
			this.server.to('' + channel.id).emit('updateMembers', '');
			this.server.to('' + socket.id).emit('updateChannels', channel.id);
		} catch (err) {
			return (err.message);
		}
		
	}

	@SubscribeMessage('createDM')
	async createDM(@MessageBody() channelInfo: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			const blocked = await this.userservice.isBlocked(senderId, channelInfo.receiverId);
			if (blocked)
				throw new Error('One of you blocked each other')
			const user = await this.userservice.findUsersById(senderId);
			const user1 = await this.userservice.findUsersById(channelInfo.receiverId);
			const chan = await this.channelservice.isDMChannel(user, user1);
			if (chan) {
				this.server.to(socket.id).emit('updateChannels', chan.id);
				return ;
			}
			const savedChat = await this.channelservice.createDmChannel({
				users: [user, user1]
			});
			const UserChannels = this.socketToChannels.get(socket.id) || [];
			if (UserChannels.length) {
				UserChannels.push('' + savedChat.id);
				socket.join('' + savedChat.id);
			}
			const blockedUserSocket_id = this.getSocketIdFromIntraId(user1.intra_id);
			if (blockedUserSocket_id) {
				const blockedUserChannels = this.socketToChannels.get(blockedUserSocket_id) || [];
				if (blockedUserChannels.length) {
					const sock = this.socket_idToSocket.get(blockedUserSocket_id);
					blockedUserChannels.push('' + savedChat.id);
					sock.join('' + savedChat.id);
				}
			}
			socket.to('' + savedChat.id).emit('updateChannels', '');
			this.server.to(socket.id).emit('updateChannels', savedChat.id);
		}catch(err) {
			return (err.message);
		}
	}

	@SubscribeMessage('blockUser')
	async blockUser(@MessageBody() info: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			await this.userservice.blockUser(senderId, info.receiverId);
		} catch (err) {
			return (err.message);
		}
	}

	@SubscribeMessage('unblockUser')
	async unblockUser(@MessageBody() info: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			await this.userservice.unblockUser(senderId, info.receiverId);
		} catch (err) {
			return (err.message);
		}
	}

	@SubscribeMessage('leaveChannel')
	async leaveVhannel(@MessageBody() info: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			await this.channelservice.leaveChannel(senderId, info.channelId);
			const channels = this.socketToChannels.get(socket.id);
			const index = channels.indexOf('' + info.channelId);
			if (index === -1) {
				return;
			}
			socket.leave(channels[index]);
			channels.splice(index, 1);
			this.server.to('' + info.channelId).emit('updateMembers', '');
			this.server.to('' + socket.id).emit('updateChannels', 0);
		} catch (err) {
			return (err.message);
		}
	}

	@SubscribeMessage('kickUser')
	async kickUser(@MessageBody() info: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(senderId);
			const receiver = await this.userservice.findUsersById(info.receiverId);
			if (!user || !receiver) {
				throw new Error('User doesnt exist');
			}
			const isAdmin = await this.channelservice.isAdmin(senderId, info.channelId);
			if (!isAdmin) {
				throw new Error('You are not administrator');
			}
			const isOwner = await this.channelservice.isOwner(info.receiverId, info.channelId);
			if (isOwner) {
				throw new Error('You cant kick channel owner');
			}
			await this.channelservice.kickUser(receiver.intra_id, info.channelId);
			const socket_id = this.getSocketIdFromIntraId(receiver.intra_id);
			if (socket_id) {
				const channels = this.socketToChannels.get(socket_id);
				if (channels.length) {
					const index = channels.indexOf('' + info.channelId);
					if (index === -1) {
						return;
					}
					const sock = this.socket_idToSocket.get(socket_id);
					sock.leave(channels[index]);
					channels.splice(index, 1);
					this.server.to('' + sock.id).emit('updateChannels', 0);
				}
			}
			this.server.to('' + info.channelId).emit('updateMembers', '');

		} catch (err) {
			return (err.message);
		}
	}

	@SubscribeMessage('banUser')
	async banUser(@MessageBody() info: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(senderId);
			const receiver = await this.userservice.findUserWithBanned(info.receiverId);
			if (!user || !receiver) {
				throw new Error('User doesnt exist');
			}
			const isAdmin = await this.channelservice.isAdmin(senderId, info.channelId);
			if (!isAdmin) {
				throw new Error('You are not administrator');
			}
			const isOwner = await this.channelservice.isOwner(info.receiverId, info.channelId);
			if (isOwner) {
				throw new Error('You cant ban channel owner');
			}
			await this.channelservice.kickUser(receiver.intra_id, info.channelId);
			await this.channelservice.banUser(receiver, info.channelId);
			const socket_id = this.getSocketIdFromIntraId(receiver.intra_id);
			if (socket_id) {
				const channels = this.socketToChannels.get(socket_id);
				if (channels.length) {
					const index = channels.indexOf('' + info.channelId);
					if (index === -1) {
						return;
					}
					const sock = this.socket_idToSocket.get(socket_id);
					sock.leave(channels[index]);
					channels.splice(index, 1);
					this.server.to('' + sock.id).emit('updateChannels', 0);
				}
			}
			this.server.to('' + info.channelId).emit('updateMembers', '');

		} catch (err) {
			return (err.message);
		}
	}

	@SubscribeMessage('muteUser')
	async muteUser(@MessageBody() info: any, @ConnectedSocket() socket: Socket) {
		try {
			const senderId = this.socket_idToIntra_id.get(socket.id);
			const user = await this.userservice.findUsersById(senderId);
			const receiver = await this.userservice.findUserWithBanned(info.receiverId);
			if (!user || !receiver) {
				throw new Error('User doesnt exist');
			}
			const isAdmin = await this.channelservice.isAdmin(senderId, info.channelId);
			if (!isAdmin) {
				throw new Error('You are not administrator');
			}
			const isOwner = await this.channelservice.isOwner(info.receiverId, info.channelId);
			if (isOwner) {
				throw new Error('You cant mute channel owner');
			}
			const channel = await this.channelservice.findChannelById(info.channelId);
			if (!channel) {
				throw new Error('Channel not exsiting');
			}
			if (channel.isDM) {
				throw new Error('You cant mute on private chat');
			}
			if (!this.muted.has(channel.id)) {
				this.muted.set(channel.id, []);
			  }
			this.muted.set(channel.id, [...this.muted.get(channel.id), receiver.intra_id]);
			setTimeout(() => {
				this.muted.set(channel.id, this.muted.get(channel.id).filter(usr => usr != receiver.intra_id))
			}, 60000)

		} catch (err) {
			return (err.message);
		}
	}

	getSocketIdFromIntraId(intra_id: number) {
		for (const [socketId, id] of this.socket_idToIntra_id) {
			if (id === intra_id) {
				return socketId;
			}
		}
		return undefined; // If the intraId is not found in the map
	}
}
