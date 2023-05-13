import { Injectable } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';

@Injectable()
export class JwtTwoFactorStrategy extends PassportStrategy(
  Strategy,
  'jwt-two-factor'
) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET_KEY')
    });
  }
 
  async validate(payload: any) {
    const user = await this.userService.findUsersById(payload.intra_id);
	if (!user)
		return ;
    if (!user.isTwoFactorAuthenticationEnabled) {
      return user;
    }
    if (payload.isSecondFactorAuthenticated) {
      return user;
    }
	
  }
}
