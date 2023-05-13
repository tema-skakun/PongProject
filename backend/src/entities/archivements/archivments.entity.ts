import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";

export enum archivement_vals {
	triggered,
	chad
};

@Entity()
export class Archivements {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User)
	holder: User;

	@Column({ nullable: false})
	type: archivement_vals;
}
