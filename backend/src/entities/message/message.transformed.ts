import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Channel } from "../channel/channel.entity";
import { User } from "../user/user.entity";
import { Expose, Transform } from "class-transformer";
import { ObjectPruning } from "src/tools/objectPruning";
import { UserTransformed } from "../user/user.transformed";
import { ChannelTransformed } from "../channel/channel.transformed";

@Entity()
export class MessageTransformed {
  @Expose()
  id: number;

  @Expose()
  text: string;

  @Expose()
  createdAt: Date;

  @Expose()
  @Transform(({value}) => ObjectPruning(UserTransformed, value))
  sender: UserTransformed;

  @Expose()
  @Transform(({value}) => ObjectPruning(ChannelTransformed, value))
  channel: ChannelTransformed;
}
