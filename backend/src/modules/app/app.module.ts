import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {TypeOrmModule} from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { GameGateway } from '../game/game.gateway';
import { GameService } from '../game/gameService';
import { RelationalTable} from '../../tools/converter';
import { DebugModule } from '../../debug/debug.module';
import { LB } from 'src/tools/LinkBack';

import { UserRestriction } from '../../classes/UserRestriction'
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../user/user.module';
import { twoFactorAuthModule } from '../auth/twoFactorAuth/twoFactorAuth.module';
import { Forty2Strategy } from 'src/GuardStrategies/42.strategy';
import { TwoFactorAuthenticationService } from '../auth/twoFactorAuth/twoFactorAuth.service';
import { JwtTwoFactorStrategy } from 'src/GuardStrategies/Jwt2F.strategy';
import { JWTStrategy } from 'src/GuardStrategies/JWT.strategy';
import entities from 'src/entities/index';
import { MatchHistoryModule } from '../game/match-history/match-history.module';
import { LadderModule } from '../ladder/ladder.module';
import { Archivements } from 'src/entities/archivements/archivments.entity';
import { ArchivementsModule } from '../archivements/archivements.module';
import { ArchivementsService } from '../archivements/archivements.service';
import { StatusModule } from '../status/status.module';
import { FriendsModule } from '../friends/friends.module';
import { ChannelModule } from '../channel/channel.module';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from '../chat/chat.gateway';
import { PreGameController } from '../game/game.controller';
import { AwsModule } from '../aws/aws.module';
import { ExistsGuardid, ExistsGuardintra_id } from 'src/GuardStrategies/UrlGuard';


@Module({
  imports: [ AwsModule, FriendsModule, StatusModule, ArchivementsModule, LadderModule, MatchHistoryModule, AuthModule, UserModule, UserModule, twoFactorAuthModule,
	JwtModule, ChannelModule, MessageModule,
	ConfigModule.forRoot({isGlobal: true }),

	TypeOrmModule.forRootAsync({
		imports: [ConfigModule],
		useFactory: (configService: ConfigService) => ({
		  type: 'postgres',
		  host: configService.get('DB_HOST'),
		  port: +configService.get<number>('DB_PORT'),
		  username: configService.get('POSTGRES_USER'),
		  password: configService.get('POSTGRES_PASSWORD'),
		  database: configService.get('POSTGRES_DB'),
		  entities: entities,
		  synchronize: true,
		}),
		inject: [ConfigService],
	  }),
	DebugModule,
	],
  controllers: [PreGameController],
  providers: [ExistsGuardid, ExistsGuardintra_id, LB, UserRestriction, RelationalTable, GameGateway, GameService,
	Forty2Strategy, TwoFactorAuthenticationService, JwtTwoFactorStrategy, JWTStrategy,
	ChatGateway],
})
export class AppModule {}

