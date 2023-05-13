import { BadRequestException, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { ChannelService } from "../channel/channel.service";
import { UserService } from "../user/user.service";
import { MessageService } from "./message.service";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";


@Controller('messages')
export class MessageController {
	constructor(private readonly messageservice: MessageService,
		private readonly userservice: UserService,
		private readonly channelservice: ChannelService) {
	}
	
	@Get('all')
	async getAllMess() {
		return await this.messageservice.getAll();
	}

	// @Post('create')
	// // @UseGuards(JwtTwoFactorGuard)
	// async newMessage(
	// 	@Req() req: any,
	// 	@Res() res: any) {
	// 		const user = await this.userservice.findUsersById(req.body.senderId);
	// 		const channel = await this.channelservice.findChannelById(req.body.channelId);
	// 		const message = {
	// 			text: req.body.text,
	// 			sender: user,
	// 			channel: channel,
	// 		}
	// 		try {
	// 			const newMessage = await this.messageservice.createMessage(message);
	// 			res.status(200).json(newMessage);
	// 		} catch(err) {
	// 			console.log('error in newMessage: ' + err);
	// 			res.status(500).json(err);
	// 		}
	// }

	@Get('/:channelId')
	@UseGuards(JwtTwoFactorGuard)
	async getChannelMessages(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const channel = await this.channelservice.findChannelById(req.params.channelId);
			if (!channel)
				throw new BadRequestException
			const channelMessages = await this.messageservice.findChannelMessages(channel);
			res.status(200).json(channelMessages);
		}catch(err) {
			console.log('error in  getChannelMessages: ' + err);
			res.status(500).json(err);
		}
	}
}