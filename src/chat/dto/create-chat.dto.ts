import { IsNotEmpty } from 'class-validator';

export class CreateChatDto {

  @IsNotEmpty()
  readonly friendId: number;

  // @IsNotEmpty()
  readonly message: string;
}
