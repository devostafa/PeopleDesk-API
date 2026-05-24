import { Injectable, NotFoundException } from '@nestjs/common';
import { FindOptionsOrder, FindOptionsWhere, Like } from 'typeorm';
import { EmployeeRepository } from '../data/repositories/employeeRepository';
import { DepartmentRepository } from '../data/repositories/departmentRepository';
import { Employee } from '../data/entities/employee';
import { Department } from '../data/entities/department';
import { CreateEmployeeRequestDto } from '../data/dtos/requestDtos/createEmployeeRequestDto';
import { UpdateEmployeeRequestDto } from '../data/dtos/requestDtos/updateEmployeeRequestDto';
import { EmpResponseDto } from '../data/dtos/responseDtos/empResponseDto';

@Injectable()
export class EmpService {
  constructor(
    private readonly employeeRepository: EmployeeRepository,
    private readonly departmentRepository: DepartmentRepository,
  ) {}

  private toDto(employee: Employee): EmpResponseDto {
    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      hireDate: employee.hireDate,
      salary: employee.salary,
      departmentId: employee.department?.id ?? null,
      departmentName: employee.department?.name ?? null,
    };
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort?: string,
  ): Promise<{ data: EmpResponseDto[]; total: number }> {
    const order: FindOptionsOrder<Employee> = {};
    if (sort) {
      const [field, direction] = sort.split(':');
      (order as any)[field] = direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    } else {
      order.id = 'DESC';
    }

    const where: FindOptionsWhere<Employee>[] = [];
    if (search) {
      where.push({ firstName: Like(`%${search}%`) });
      where.push({ lastName: Like(`%${search}%`) });
      where.push({ email: Like(`%${search}%`) });
    }

    const [employees, total] = await this.employeeRepository.findAndCount({
      relations: { department: true },
      where: where.length > 0 ? where : undefined,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: employees.map((e) => this.toDto(e)),
      total,
    };
  }

  async getById(id: string): Promise<EmpResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { department: true },
    });
    if (!employee) throw new NotFoundException(`Employee #${id} not found`);
    return this.toDto(employee);
  }

  async create(dto: CreateEmployeeRequestDto): Promise<EmpResponseDto> {
    let department: Department | null = null;
    if (dto.departmentId) {
      department = await this.departmentRepository.findOne({
        where: { id: dto.departmentId },
      });
      if (!department)
        throw new NotFoundException(
          `Department #${dto.departmentId} not found`,
        );
    }

    const employee = this.employeeRepository.create({
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      hireDate: dto.hireDate,
      salary: dto.salary,
      department: department ?? undefined,
    });

    const saved = await this.employeeRepository.save(employee);
    return this.getById(saved.id);
  }

  async update(
    id: string,
    dto: UpdateEmployeeRequestDto,
  ): Promise<EmpResponseDto> {
    const employee = await this.employeeRepository.findOne({
      where: { id },
      relations: { department: true },
    });
    if (!employee) throw new NotFoundException(`Employee #${id} not found`);

    if (dto.firstName !== undefined) employee.firstName = dto.firstName;
    if (dto.lastName !== undefined) employee.lastName = dto.lastName;
    if (dto.email !== undefined) employee.email = dto.email;
    if (dto.hireDate !== undefined) employee.hireDate = dto.hireDate;
    if (dto.salary !== undefined) employee.salary = dto.salary;

    if (dto.departmentId !== undefined) {
      if (dto.departmentId === null) {
        employee.department = null;
      } else {
        const department = await this.departmentRepository.findOne({
          where: { id: dto.departmentId },
        });
        if (!department)
          throw new NotFoundException(
            `Department #${dto.departmentId} not found`,
          );
        employee.department = department;
      }
    }

    await this.employeeRepository.save(employee);
    return this.getById(id);
  }

  async delete(id: string): Promise<void> {
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) throw new NotFoundException(`Employee #${id} not found`);
    await this.employeeRepository.remove(employee);
  }
}
