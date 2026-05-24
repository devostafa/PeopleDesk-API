import { Injectable } from '@nestjs/common';
import { EmployeeRepository } from '../data/repositories/employeeRepository';
import { DepartmentRepository } from '../data/repositories/departmentRepository';
import { AnalyticsSummaryResponseDto } from '../data/dtos/responseDtos/analyticsSummaryResponseDto';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  async getSummary(): Promise<AnalyticsSummaryResponseDto> {
    const totalEmployeesCount = await this.employeeRepository.findAndCount({
      take: 0,
    });

    const [recentHires] = await this.employeeRepository.findAndCount({
      relations: { department: true },
      order: { hireDate: 'DESC' },
      take: 5,
    });

    const departments = await this.departmentRepository.findAndCount();
    const distribution = await Promise.all(
      departments[0].map(async (dept) => {
        const count = await this.employeeRepository.findAndCount({
          where: { departmentId: dept.id },
          take: 0,
        });
        return {
          departmentName: dept.name,
          count: count[1],
        };
      }),
    );

    return {
      totalEmployeesCount: totalEmployeesCount[1],
      recentHires: recentHires.map((emp) => ({
        id: emp.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        hireDate: emp.hireDate,
        departmentName: emp.department?.name ?? 'N/A',
      })),
      departmentDistribution: distribution,
    };
  }
}
