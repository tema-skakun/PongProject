import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/modules/user/user.module";
import { AuthenticationService } from "../auth.service";
import { twoFactorAuthController } from "./twoFactorAuth.controller";
import { TwoFactorAuthenticationService } from "./twoFactorAuth.service";

@Module({
	imports: [TypeOrmModule, UserModule],
	controllers: [twoFactorAuthController],
	providers: [TwoFactorAuthenticationService, JwtService, AuthenticationService],
	exports: [TwoFactorAuthenticationService],
})
export class twoFactorAuthModule {}