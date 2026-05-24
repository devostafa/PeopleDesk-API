import { ApiProperty } from '@nestjs/swagger';

export class RecentHireDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  hireDate!: Date;

  @ApiProperty()
  departmentName!: string;
}

export class DepartmentDistributionDto {
  @ApiProperty()
  departmentName!: string;

  @ApiProperty()
  count!: number;
}

export class AnalyticsSummaryResponseDto {
  @ApiProperty()
  totalEmployeesCount!: number;

  @ApiProperty({ type: [RecentHireDto] })
  recentHires!: RecentHireDto[];

  @ApiProperty({ type: [DepartmentDistributionDto] })
  departmentDistribution!: DepartmentDistributionDto[];
}
