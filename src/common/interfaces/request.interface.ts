import { UserEntity } from '../../users/user.entity';

export interface Request extends Express.Request {
  user: UserEntity;
}
