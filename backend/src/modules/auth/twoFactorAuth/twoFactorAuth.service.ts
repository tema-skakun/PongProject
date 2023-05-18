import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { User } from '../../../entities/user/user.entity'
import { UserService } from '../../user/user.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class TwoFactorAuthenticationService {
	constructor (
		private readonly usersservice: UserService,
		private readonly configService: ConfigService,
		private readonly jwtService: JwtService,
	) {}

	public async generateTwoFactorAuthenticationSecret(user: User) {
		const secret = authenticator.generateSecret();
	 
		const otpauthUrl = authenticator.keyuri(user.email,
			this.configService.get('2F_APP_NAME'), secret);
		await this.usersservice.setTwoFactorAuthenticationSecret(secret, user.intra_id);
		const us = await this.usersservice.findUsersById(user.intra_id);
		return {
		  secret,
		  otpauthUrl
		}
	}

	public isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, user: User) {
		return authenticator.verify({
		  token: twoFactorAuthenticationCode,
		  secret: user.twoFactorAuthenticationSecret,
		})
	}

}

