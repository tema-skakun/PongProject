import { Expose, Transform, Exclude} from 'class-transformer';
import { User } from '../user/user.entity';
import { ObjectPruning } from 'src/tools/objectPruning';
import { UserTransformed } from '../user/user.transformed';

export class MatchHistoryTransformed {
	@Expose()
	id: number;

	@Exclude()
	played_at: Date;

	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	looser: UserTransformed;

	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	winner: UserTransformed;

	@Expose()
	looserGoals: number;

	@Expose()
	winnerGoals: number;
}
