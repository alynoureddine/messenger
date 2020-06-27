import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GroupEntity } from '../group/group.entity';

@Entity()
export class GroupMessageEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToMany(type => GroupEntity, group => group.messages)
  group: GroupEntity;

  @Column('text', { nullable: false })
  text: string;

  @CreateDateColumn()
  date: string;
}
