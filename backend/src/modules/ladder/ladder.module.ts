import { Module } from '@nestjs/common';
import { LadderService } from './ladder.service';
import { LadderController } from './ladder.controller';
import { MatchHistoryModule } from '../game/match-history/match-history.module';
import { UserModule } from '../user/user.module';

@Module({
	imports: [MatchHistoryModule, UserModule],
  providers: [LadderService],
  controllers: [LadderController]
})
export class LadderModule {}
