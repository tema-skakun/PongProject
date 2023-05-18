import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendsController } from './friends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities';
import { StatusModule } from '../status/status.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [UserModule, TypeOrmModule.forFeature([User]), StatusModule],
  	providers: [FriendsService],
  	controllers: [FriendsController]
})
export class FriendsModule {}
