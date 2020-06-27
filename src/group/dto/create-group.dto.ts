import { IsNotEmpty } from 'class-validator';

export class CreateGroupDto {

  @IsNotEmpty()
  readonly friendIds: number[];
}
