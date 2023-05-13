import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, Timestamp } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class MatchHistoryEntry {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	played_at: Date;


	@ManyToOne(() => User)
	looser: User;

	@Column({type: 'int'})
	looserGoals: number;

	@ManyToOne(() => User)
	winner: User;

	@Column({type: 'int'})
	winnerGoals: number;
}
