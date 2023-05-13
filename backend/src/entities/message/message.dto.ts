import { IsString } from "class-validator";
import { Channel } from "../channel/channel.entity";
import { User } from "../user/user.entity";


export class MessageDto {
	@IsString()
	text: string;

	sender: User;

	channel: Channel;
}