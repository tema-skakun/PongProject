import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "src/entities/message/message.entity";
import { ChannelModule } from "../channel/channel.module";
import { UserModule } from "../user/user.module";
import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";


@Module({
	imports: [TypeOrmModule.forFeature([Message]), UserModule, ChannelModule],
	controllers: [MessageController],
	providers: [MessageService],
	exports: [MessageService],
})
export class MessageModule {}