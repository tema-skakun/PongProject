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
  
	@Expose()
	@Transform(({value}) => {return isNotEmpty(value) && (value !== '')})
	password?: boolean;
  
	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	owner?: UserTransformed;
  
	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	users: UserTransformed[];
  
	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	administrators?: UserTransformed[];

	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
  	invited?: UserTransformed[];

	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
  	bannedUsers?: UserTransformed[];

	@Expose()
	updated_at: Date;
}