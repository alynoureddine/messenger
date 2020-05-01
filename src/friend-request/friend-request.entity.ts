import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../users/user.entity';
import { FriendRequestStatus } from './enum/friend-request.status';
import { Exclude } from 'class-transformer';

@Entity()
export class FriendRequestEntity {

  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    type: 'enum',
    enum: FriendRequestStatus,
    default: FriendRequestStatus.PENDING,
  })
  status: FriendRequestStatus;

  @Exclude()
  @ManyToOne(type => UserEntity, user => user)
  requester: UserEntity;

  @Exclude()
  @ManyToOne(type => UserEntity, user => user)
  responder: UserEntity;
}
