import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../user/user.entity";
import { Exclude, Expose, Transform } from "class-transformer";
import { ObjectPruning } from "src/tools/objectPruning";
import { UserTransformed } from "../user/user.transformed";
import { isNotEmpty } from "class-validator";

@Entity()
export class ChannelTransformed {
	@Expose()
	id: number;
  
	@Expose()
	name?: string;
  
	@Expose()
	isPrivate: boolean;

	@Expose()
	isDM: boolean;
  
	@Transform(({value}) => isNotEmpty(value))
	password?: boolean;
  
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	owner?: UserTransformed;
  
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	users: UserTransformed[];
  
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	administrators?: UserTransformed[];

	@Transform(({value}) => ObjectPruning(UserTransformed, value))
  	invited?: UserTransformed[];

	@Transform(({value}) => ObjectPruning(UserTransformed, value))
  	bannedUsers?: UserTransformed[];

	@Expose()
	updated_at: Date;
}