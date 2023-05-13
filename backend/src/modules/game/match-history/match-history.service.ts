import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MatchHistoryEntry } from 'src/entities/matchHistoryEntry/matchHistoryEntry.entity';
import { Repository } from 'typeorm';
import { matchHistoryInterface } from 'src/entities/matchHistoryEntry/matchHistory.interface';

@Injectable()
export class MatchHistoryService {
	constructor(
		@InjectRepository(MatchHistoryEntry) private rep: Repository<MatchHistoryEntry>
	) {}

	create(mh: matchHistoryInterface): Promise<MatchHistoryEntry> {
		const matchHistoryEntry: MatchHistoryEntry = new MatchHistoryEntry();
		matchHistoryEntry.winner = mh.winner;
		matchHistoryEntry.winnerGoals = mh.winnerGoals;
		matchHistoryEntry.looser = mh.looser;
		matchHistoryEntry.looserGoals = mh.looserGoals;

		return this.rep.save(matchHistoryEntry);
	}

	save(mh: MatchHistoryEntry): Promise<MatchHistoryEntry> {
		return this.rep.save(mh);
	}

	async get(intraId: number): Promise<MatchHistoryEntry []> {
		return ( this.rep.createQueryBuilder('match')
		.leftJoinAndSelect('match.winner', 'winner')
			.leftJoinAndSelect('match.looser', 'looser')
			.where("winner.intra_id = :intraId", {intraId})
			.orWhere("looser.intra_id = :intraId", {intraId})
			.getMany()
		)
	}
}
