import { User } from "../user/user.entity";

export interface matchHistoryInterface {
	looser: User;
	looserGoals: number;
	winner: User;
	winnerGoals: number;
}