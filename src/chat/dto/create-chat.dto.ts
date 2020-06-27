import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {

  @IsNotEmpty()
  readonly friendId: number;
}
