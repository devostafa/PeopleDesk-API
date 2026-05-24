import { ApiProperty } from '@nestjs/swagger';

export class EmpResponseDto {
  @ApiProperty()
  id!: number;

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

  @ApiProperty({ nullable: true })
  departmentId!: number | null;

  @ApiProperty({ nullable: true })
  departmentName!: string | null;
}
