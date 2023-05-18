import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from 'passport-42';
import { Injectable } from "@nestjs/common";
import axios from "axios";
import { User } from "src/entities/user/user.entity";
import { UserService } from "src/modules/user/user.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class Forty2Strategy extends PassportStrategy(Strategy, '42') {
	constructor(private userservice: UserService,
		private readonly configService: ConfigService,) {
		super({
			clientID: configService.get('CLIENTID'),
			clientSecret: configService.get('CLIENTSECRET'),
			callbackURL: configService.get('CALLBACKURL'),
			scope: ['public'],
		});
	}

	async validate(accessToken: string, refreshToken: string, profile: Profile, done:
		 VerifyCallback): Promise<User> {
			const usr = await this.userservice.findUsersById(profile.id);
			if (usr)
			{
				return done(null, usr);
			}
			else {
				const apiClient = axios.create({
					baseURL: 'https://api.intra.42.fr',
					headers: {
						Authorization: 'Bearer ' + accessToken,
					}
				})
				const apiResponse = await apiClient.get('/v2/users/' + profile.id);
				const user = {
					intra_id: Number(apiResponse.data.id),
					email: apiResponse.data.email,
					username: apiResponse.data.login,
					picture_url: apiResponse.data.image.versions.medium,
					first_name: apiResponse.data.first_name,
					last_name: apiResponse.data.last_name,
					accessToken,
					refreshToken,
				}
				let num = 1;
				while (await this.userservice.findUniqueByusername(user.username)) {
					user.username = user.username + num;
					num++;
				}

				// const user1 = {
				// 	intra_id: 123,
				// 	email: '123@123.lv',
				// 	username: 'bobo123',
				// 	picture_url: apiResponse.data.image.versions.medium,
				// 	first_name: '123',
				// 	last_name: '321',
				// 	accessToken: '123',
				// 	refreshToken,
				// }
				// await this.userservice.createUser(user1);

				return done(null, await this.userservice.createUser(user))
			}
		 }
}
