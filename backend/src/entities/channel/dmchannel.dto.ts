import { IsBoolean, IsNumber, IsString } from "class-validator"
import { User } from "../user/user.entity";

export class dmChannelDto {

	users: User[];
  
}