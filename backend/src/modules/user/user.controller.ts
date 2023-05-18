import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
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
import { ExistsGuardid } from 'src/GuardStrategies/UrlGuard';

@Controller('users')
export class UserController {
	constructor(private readonly userservice: UserService) {
	}

	@Get('user/:id?')
	@UseGuards(ExistsGuardid)
	@UseGuards(JwtTwoFactorGuard)
	async getMyself(@Req() req: any, @Param('id') id: string) {
		let chosenId: number = req.user.intra_id;

		if (id && !isNaN(Number(id))) {
			chosenId = Number(id);
		}

	
		return ObjectPruning( UserTransformed, await this.userservice.findUsersById(chosenId));
	}

	// @Get('all')
	// async getalluser() {
	// 	return await this.userservice.getUsers();
	// 	// return ObjectPruningMany(UserTransformed, await this.userservice.getUsers());
	// }

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
			res.status(400).json(err);
		}
	}

	@Put('update/pic')
	@UseGuards(JwtTwoFactorGuard)
	updatePic(
		@Req() req: any,
		@Body() {profilePic, username}: any) { // @Body() { username, profilePic } : any,
		return this.userservice.updatePic(req.user.intra_id, profilePic);
	}

	@Put('update/username')
	@UseGuards(JwtTwoFactorGuard)
	updateUsername(
		@Req() req: any,
		@Body() {username}: any) { // @Body() { username, profilePic } : any,
		return this.userservice.updateUsername(req.user.intra_id, username);
	}

	// @Post('create')
	// async createUser(@Body() dto: UserDto) {
	// 	return ObjectPruning(UserTransformed , await this.userservice.createUser(dto));
	// }

	// @Delete('delete')
	// deleteusr(@Body() id: any) {
	// 	this.userservice.deleteuser(id.intra_id);
	// }
}
