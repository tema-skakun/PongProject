import { BadRequestException, Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ExceptionsHandler } from "@nestjs/core/exceptions/exceptions-handler";
import { ChannelService } from "../channel/channel.service";
import { UserService } from "../user/user.service";
import { MessageService } from "./message.service";
import JwtTwoFactorGuard from "src/GuardStrategies/Jwt2F.guard";
import { ObjectPruningMany } from "src/tools/objectPruning";
import { MessageTransformed } from "src/entities/message/message.transformed";


@Controller('messages')
export class MessageController {
	constructor(private readonly messageservice: MessageService,
		private readonly userservice: UserService,
		private readonly channelservice: ChannelService) {
	}
	
	// @Get('all')
	// @UseGuards(JwtTwoFactorGuard)
	// async getAllMess() {
	// 	return ObjectPruningMany(MessageTransformed, await this.messageservice.getAll());
	// }


	@Get('channel/:channelId')
	@UseGuards(JwtTwoFactorGuard)
	async getChannelMessages(
		@Req() req: any,
		@Res() res: any
	) {
		try {
			const channel = await this.channelservice.findChannelById(req.params.channelId);
			if (!channel)
				throw new Error('No such channel')
			const isMember = await this.userservice.isAmember(req.user.intra_id, channel.id);
			if (!isMember){
				throw new Error('You are not a member');
			}
			const channelMessages = await this.messageservice.findChannelMessages(channel);
			res.status(200).json(ObjectPruningMany( MessageTransformed ,channelMessages));
		}catch(err) {
			res.status(400).json(err);
		}
	}
}