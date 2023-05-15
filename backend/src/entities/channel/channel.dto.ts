import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { User } from "../user/user.entity";

export class ChannelDto { 
	@IsString()
	@IsNotEmpty()
	name: string;
  
	@IsBoolean()
	isPrivate?: boolean;

	@IsBoolean()
	isDM: boolean;
  
	@IsString()
	password?: string;
  
	owner: User;
  
	users: User[];

	administrators: User[];

}