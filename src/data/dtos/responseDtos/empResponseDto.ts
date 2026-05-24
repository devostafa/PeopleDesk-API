import { ApiProperty } from '@nestjs/swagger';

export class EmpResponseDto {
  @ApiProperty()
  id!: string;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  hireDate!: Date;

  @ApiProperty()
  salary!: number;

  @ApiProperty()
  departmentId!: string;

  @ApiProperty()
  departmentName!: string;
}
