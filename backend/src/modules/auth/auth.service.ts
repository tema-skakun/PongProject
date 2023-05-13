import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';


@Injectable()
export class AuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
 
  public getCookieWithJwtAccessToken(intra_id: number, isSecondFactorAuthenticated = false) {
    const payload: any = { intra_id, isSecondFactorAuthenticated };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_SECRET_KEY'),
    });
    return token;
  }
 
  
}