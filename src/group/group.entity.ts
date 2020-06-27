import { Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { GroupMessageEntity } from '../group-message/group-message.entity';

@Entity()
export class GroupEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToMany(type => UserEntity)
  @JoinTable()
  users: UserEntity[];

  @OneToMany(type => GroupMessageEntity, message => message.group)
  messages: GroupMessageEntity[];
}
