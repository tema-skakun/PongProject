import { IsNotEmpty, IsString } from "class-validator";
import { Channel } from "../channel/channel.entity";
import { User } from "../user/user.entity";


export class MessageDto {
	@IsString()
	text: string;

	@IsNotEmpty()
	sender: User;

	@IsNotEmpty()
	channel: Channel;
}