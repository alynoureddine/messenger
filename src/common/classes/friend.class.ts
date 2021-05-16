import { UserEntity } from '../../users/user.entity';

export class Friend {
  public id: number;
  public username: string;
  public isOnline: boolean;
  public lastSeen: Date;
  public firstName: string;
  public lastName: string;
  public email: string;
  public bio: string;
  public image: string;

  constructor(user: UserEntity, lastSeen: Date, isConnected: boolean) {
    this.id = user.id;
    this.username = user.username;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.bio = user.bio;
    this.image = user.image;
    this.isOnline = isConnected;
    this.lastSeen = lastSeen ?? user.createDate;
  }
}
