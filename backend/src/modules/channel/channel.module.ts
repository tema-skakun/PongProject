import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from 'src/entities/channel/channel.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { ChannelController } from './channel.controller';
import { ChannelService } from './channel.service';


@Module({
	imports: [TypeOrmModule.forFeature([Channel]), UserModule],
	controllers: [ChannelController],
	providers: [ChannelService],
	exports: [ChannelService],
})
export class ChannelModule {}