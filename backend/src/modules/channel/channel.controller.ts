import { Body, Controller, ForbiddenException, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { dmChannelDto } from "src/entities/channel/dmchannel.dto";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";
import { UserService } from "../user/user.service";
import { ChannelService } from "./channel.service";
import { encodePassword } from "src/tools/bcrypt";
import { comparePassword } from 'src/tools/bcrypt';
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { ObjectPruning, ObjectPruningMany } from "src/tools/objectPruning";
import { ChannelTransformed } from "src/entities/channel/channel.transformed";
import { UserTransformed } from "src/entities/user/user.transformed";


@Controller('chat')
export class ChannelController {
	constructor(private readonly channelservice: ChannelService,
		private readonly userservice: UserService,
		) {}

	// @Get('all')
	// async getUsers() {
	// 	return ObjectPruningMany(ChannelTransformed, await this.channelservice.getChannels());
	// }

	@Get('usersToInvite/:channelId')
	@UseGuards(JwtTwoFactorGuard)
	async getUsersToInvite(
		@Req() req: any,
		@Res() res: any,
	) {
		try {
			const users = await this.userservice.getnotBlockedUsers(req.user.intra_id);
			const inviteUsers = await this.channelservice.usersToInvite(users, req.params.channelId);
			res.status(200).json(inviteUsers);
		}catch(err) {
			res.status(400).json({ error: err.message });
		}
	}

	@Post('invite/:channelId')
	@UseGuards(JwtTwoFactorGuard)
	async sendInvite(
		@Req() req: any,
		@Res() res: any,
	) {
		try {
			const user = await this.userservice.findUsersById(req.body.receiverId);
			if (!user) {
				throw new Error('User doesnt exist');
			}
			await this.channelservice.inviteUserToChannel(req.params.channelId, user);
			res.status(200).json();
		}catch(err) {
			res.status(400).json({ error: err.message });
		}
	}

	@Post('changePassword/:channelId')
	@UseGuards(JwtTwoFactorGuard)
	async changePassword(
		@Req() req: any,
		@Res() res: any,
	) {
		try {
			const isOwner = await this.channelservice.isOwner(req.user.intra_id, req.params.channelId);
			if (!isOwner) {
				throw new Error('You are not the owner of the channel')
			}
			await this.channelservice.changePassword(req.params.channelId, req.body.password);
			res.status(200).json();
		}catch(err) {
			res.status(400).json({ error: err.message });
		}
	}

	@Get('channelUsers/:channel_id')
	@UseGuards(JwtTwoFactorGuard)
	async getChannel(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const userChannels = await this.channelservice.findChannelUsers(req.params.channel_id);
			res.status(200).json(ObjectPruningMany(UserTransformed, userChannels));
		}catch(err) {
			res.status(400).json(err.message);
		}
	}
	
	@Get('channelsCanJoin')
	@UseGuards(JwtTwoFactorGuard)
	async channelsCanJoin(
		@Req() req: any,
		@Res() res: any,)
	{
		try {
			const channels = await this.channelservice.findChannelsUserCanJoin(req.user);
			res.status(200).json(ObjectPruningMany(ChannelTransformed, channels));
		}catch(err) {
			res.status(400).json(err.message);
		}
	}

	@Get('chat/:intra_id')
	@UseGuards(JwtTwoFactorGuard)
	async getUserChannels(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			if (req.params.intra_id !== req.user.intra_id)
				throw new ForbiddenException('you did something wrong');
			const userChannels = await this.channelservice.findUserChannels(req.params.intra_id);
			res.status(200).json(ObjectPruningMany(ChannelTransformed, userChannels));
		}catch(err) {
			res.status(400).json(err.message);
		}
	}

	@Post('makeAdmin')
	@UseGuards(JwtTwoFactorGuard)
	async makeAdmin(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const user = await this.userservice.findUsersById(req.body.userId);
			if (!user) {
				throw new Error('User doesnt exist');
			}
			const isAdmin = await this.channelservice.isAdmin(req.user.intra_id, req.body.channelId);
			if (!isAdmin) {
				throw new Error('You are not administrator');
			}
			await this.channelservice.addAdminToChannel(user, req.body.channelId);
			res.status(200).json({ message: 'User is now an administrator of the channel' });
		}catch(err) {
			res.status(400).json({ error: err.message });
		}
	}

}
