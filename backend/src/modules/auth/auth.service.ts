import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from 'src/entities/user/user.entity';


@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
 
  public getCookieWithJwtAccessToken(user: User, isSecondFactorAuthenticated = false) {
	const payload = { email: user.email, intra_id: user.intra_id, token: user.accessToken, isSecondFactorAuthenticated: isSecondFactorAuthenticated};
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });
    return token;
  }
 
  
}