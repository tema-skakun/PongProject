import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryController } from './match-history.controller';
import { UserModule } from 'src/modules/user/user.module';

@Module({
	imports: [UserModule, TypeOrmModule.forFeature([MatchHistoryEntry])],
	providers: [MatchHistoryService],
	exports: [MatchHistoryService],
	controllers: [MatchHistoryController]
})
export class MatchHistoryModule {}
