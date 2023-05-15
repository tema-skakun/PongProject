import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"
import { User } from "../user/user.entity";

export class dmChannelDto {

	@IsArray()
	@IsNotEmpty()
	users: User[];
  
}