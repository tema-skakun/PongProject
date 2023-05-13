import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "src/modules/user/user.module";
import { AuthenticationController } from "./auth.controller";
import { AuthenticationService } from "./auth.service";

@Module({
	imports: [TypeOrmModule, UserModule],
	controllers: [AuthenticationController],
	providers: [AuthenticationService, JwtService],
	exports: [AuthenticationService],
})
export class AuthModule {}
