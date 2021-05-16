import { IsNotEmpty } from 'class-validator';

export class CreateMessageDto {

  @IsNotEmpty()
  readonly text: string;

  @IsNotEmpty()
  readonly chatId: number;
}
