import {
	Body,
	Controller,
	Delete,
	Get,
	Post,
	Put,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common'
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
import { UserDto } from '../../entities/user/user.dto';
import { UserService } from './user.service'
import { ObjectPruning, ObjectPruningMany } from 'src/tools/objectPruning';
import { UserTransformed } from 'src/entities/user/user.transformed';

@Controller('users')
export class UserController {
	constructor(private readonly userservice: UserService) {
	}

	@Get('all')
	async getalluser() {
		return ObjectPruningMany(UserTransformed, await this.userservice.getUsers());
	}

	@Get('notBlockedUsers')
	@UseGuards(JwtTwoFactorGuard)
	async getUsers(
		@Req() req: any,
		@Res() res: any,
	) {
		try {
			const users = await this.userservice.getnotBlockedUsers(req.user.intra_id);
			res.status(200).json(ObjectPruningMany(UserTransformed, users));
		}catch(err) {
			console.log('error: ' + err);
			res.status(400).json(err);
		}
	}

	@Put('update')
	@UseGuards(JwtTwoFactorGuard)
	updateUser( 
		@Req() req: any,
		@Body() { username, profilePic } : any) {
		return this.userservice.updateUsernameAndPic(req.user.intra_id, username, profilePic);
	}

	@Post('create')
	async createUser(@Body() dto: UserDto) {
		return ObjectPruning(UserTransformed , await this.userservice.createUser(dto));
	}

	@Delete('delete')
	deleteusr(@Body() id: any) {
		this.userservice.deleteuser(id.intra_id);
	}
}
