import { ApiProperty } from '@nestjs/swagger';

export class DeptResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  name!: string;
}
