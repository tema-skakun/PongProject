import { Body, Controller, ForbiddenException, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { dmChannelDto } from "src/entities/channel/dmchannel.dto";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";
import { UserService } from "../user/user.service";
import { ChannelService } from "./channel.service";
import { encodePassword } from "src/tools/bcrypt";
import { comparePassword } from 'src/tools/bcrypt';
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";


@Controller('chat')
export class ChannelController {
	constructor(private readonly channelservice: ChannelService,
		private readonly userservice: UserService,
		) {}

	@Get('all')
	getUsers() {
		return this.channelservice.getChannels();
	}

	@Get('channelUsers/:channel_id')
	@UseGuards(JwtTwoFactorGuard)
	async getChannel(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const userChannels = await this.channelservice.findChannelUsers(req.params.channel_id);
			res.status(200).json(userChannels);
		}catch(err) {
			console.log('error: ' + err);
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
			res.status(200).json(channels);
		}catch(err) {
			res.status(400).json(err.message);
		}
	}

	@Get('/:intra_id')
	@UseGuards(JwtTwoFactorGuard)
	async getUserChannels(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			if (req.params.intra_id !== req.user.intra_id)
				throw new ForbiddenException('you did something wrong');
			const userChannels = await this.channelservice.findUserChannels(req.params.intra_id);
			res.status(200).json(userChannels);
		}catch(err) {
			console.log('error: ' + err);
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
			console.log('error: ' + err);
			res.status(400).json({ error: err.message });
		}
	}

	// @Post('createDM')
	// @UseGuards(JwtTwoFactorGuard)
	// async newDmChannel(
	// 	@Req() req: any,
	// 	@Res() res: any) {
	// 	try {
	// 		const user = await this.userservice.findUsersById(req.body.senderId);
	// 		const user1 = await this.userservice.findUsersById(req.body.receiverId);
	// 		const savedChat = await this.channelservice.createDmChannel({
	// 			users: [user, user1]
	// 		});
	// 		res.status(200).json(savedChat);
	// 	}catch(err) {
	// 		console.log('error: ' + err);
	// 		res.status(500).json(err);
	// 	}
	// }
	
	// @Post('joinChannel')
	// @UseGuards(JwtTwoFactorGuard)
	// async joinChannel(
	// 	@Req() req: any,
	// 	@Res() res: any) {
	// 	try {
	// 		const channel = await this.channelservice.findChannelById(req.body.channelId);
	// 		if (!channel)
	// 			throw new ForbiddenException('No such channel');
	// 		if (!req.body.password || !comparePassword(req.body.password, channel.password))
	// 			throw new ForbiddenException('Wrong password');
	// 		if (channel.isPrivate && !this.channelservice.isInvited(channel.id, req.user)) {
	// 			throw new ForbiddenException('You are not invited');
	// 		} 
	// 		res.status(200).json();
	// 	} catch (err) {
	// 		res.status(500).json(err);
	// 	}
	// }

}
