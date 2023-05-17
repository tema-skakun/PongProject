import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../user/user.entity";
import { archivement_vals } from "./archivments.entity";
import { Expose, Transform } from "class-transformer";
import { ObjectPruning } from "src/tools/objectPruning";
import { UserTransformed } from "../user/user.transformed";


@Entity()
export class ArchivementsTransformed {
	@Expose()
	id: number;

	@Expose()
	@Transform(({value}) => ObjectPruning(UserTransformed, value))
	holder: UserTransformed;

	@Expose()
	type: archivement_vals;
}
