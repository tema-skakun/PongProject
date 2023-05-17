import {
	ClassSerializerInterceptor,
	Controller,
	Post,
	UseInterceptors,
	Res,
	UseGuards,
	Req,
	HttpCode,
	Body,
	UnauthorizedException,
  } from '@nestjs/common';
import { TwoFactorAuthenticationService } from './twoFactorAuth.service';
import { Response } from 'express';
import { UserService } from 'src/modules/user/user.service';
import { AuthenticationService } from '../auth.service';
import JwtGuard from 'src/GuardStrategies/jwt.guard';
import * as qrcode from 'qrcode';
import JwtTwoFactorGuard from 'src/GuardStrategies/Jwt2F.guard';
   
  @Controller('2fa')
  @UseInterceptors(ClassSerializerInterceptor)
  export class twoFactorAuthController {
	constructor(
	  private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
	  private readonly userService: UserService,
	  private readonly authenticationService: AuthenticationService,
	) {}

	@Post('turn-on')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async turnOnTwoFactorAuthentication(
		@Req() request: any,
		@Res() res: any,
		@Body() { twoFactorAuthenticationCode } : any
	) {
		try {
			const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
			twoFactorAuthenticationCode, request.user
			);
			if (!isCodeValid) {
				throw new Error('Wrong authentication code');
			}
			await this.userService.turnOnTwoFactorAuthentication(request.user.intra_id);
			const accessToken = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
			res.status(200).json(accessToken);
		} catch(err) {
			res.status(400).json({ message: err.message });
		}
	}

	@Post('generate')
	@UseGuards(JwtGuard)
	async register(@Res() res: Response, @Req() req: any) {
		if (!req.user.isTwoFactorAuthenticationEnabled) {
			const { otpauthUrl } = await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecret(req.user);
			const qrCode = await qrcode.toBuffer(otpauthUrl);

			res.setHeader('Content-Type', 'image/png'); // Update with the appropriate MIME type
			res.send(qrCode);
		}
	}

	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(JwtGuard)
	async authenticate(
		@Req() request: any,
		@Body() { twoFactorAuthenticationCode } : any
	) {
		const isCodeValid = this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode, request.user
		);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
	
		const accessToken = this.authenticationService.getCookieWithJwtAccessToken(request.user.id, true);
	
		return accessToken;
	}
	
	@Post('turn-off')
	@UseGuards(JwtTwoFactorGuard)
	async turnOffTwoFactorAuthentication(
		@Req() request: any,
		@Res() res: any,
	) {
		try {
			await this.userService.turnOffTwoFactorAuthentication(request.user.intra_id);
			res.status(200).json();
		} catch (err) {
			res.status(400).json(err);
		}
	}
  }