import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";

@Entity()
export class Channel {
	@PrimaryGeneratedColumn()
	id: number;
  
	@Column({ nullable: true, unique: true })
	name?: string;
  
	@Column({ default: false })
	isPrivate: boolean;

	@Column({ default: true })
	isDM: boolean;
  
	@Column({ nullable: true })
	password?: string;
  
	@ManyToOne(() => User, user => user.ownedChannels)
	owner?: User;
  
	@ManyToMany(() => User, user => user.channels)
	@JoinTable()
	users: User[];
  
	@ManyToMany(() => User, user => user.administeredChannels)
	@JoinTable()
	administrators?: User[];

	@ManyToMany(() => User, user => user.invitedToChannels)
	@JoinTable()
  	invited?: User[];

	@ManyToMany(() => User, user=> user.bannedFromChannels)
	@JoinTable()
  	bannedUsers?: User[];

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updated_at: Date;
}