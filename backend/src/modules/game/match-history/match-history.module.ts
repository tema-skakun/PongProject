import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { MatchHistoryService } from './match-history.service';
import { MatchHistoryController } from './match-history.controller';

@Module({
	imports: [TypeOrmModule.forFeature([MatchHistoryEntry])],
	providers: [MatchHistoryService],
	exports: [MatchHistoryService],
	controllers: [MatchHistoryController]
})
export class MatchHistoryModule {}
