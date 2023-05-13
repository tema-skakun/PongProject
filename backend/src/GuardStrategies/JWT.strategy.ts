import { Injectable } from "@nestjs/common";
import { ExtractJwt, Strategy, VerifyCallback } from "passport-jwt";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "src/modules/user/user.service";
import { PassportStrategy } from "@nestjs/passport";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private jwtservice: JwtService,
		private userservice: UserService,
		private readonly configService: ConfigService,) {
			super({
				jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
				secretOrKey: configService.get('JWT_SECRET_KEY'),
			  });
			}
		   
		async validate(payload: any) {
			
			return await this.userservice.findUsersById(payload.intra_id);
		}
}
