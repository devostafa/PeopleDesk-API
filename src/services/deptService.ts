import { Injectable, NotFoundException } from '@nestjs/common';
import { Like } from 'typeorm';
import { DepartmentRepository } from '../data/repositories/departmentRepository';
import { Department } from '../data/entities/department';
import { CreateDepartmentRequestDto } from '../data/dtos/requestDtos/createDepartmentRequestDto';
import { UpdateDepartmentRequestDto } from '../data/dtos/requestDtos/updateDepartmentRequestDto';
import { DeptResponseDto } from '../data/dtos/responseDtos/deptResponseDto';

@Injectable()
export class DeptService {
  constructor(private readonly departmentRepository: DepartmentRepository) {}

  private toDto(department: Department): DeptResponseDto {
    return {
      id: department.id,
      name: department.name,
    };
  }

  async getAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sort?: string,
  ): Promise<{ data: DeptResponseDto[]; total: number }> {
    const order: any = {};
    if (sort) {
      const [field, direction] = sort.split(':');
      order[field] = direction?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    } else {
      order.id = 'DESC';
    }

    const where: any = [];
    if (search) {
      where.push({ name: Like(`%${search}%`) });
    }

    const [departments, total] = await this.departmentRepository.findAndCount({
      where: where.length > 0 ? where : undefined,
      order,
      skip: (page - 1) * limit,
      take: limit,
    });
    return {
      data: departments.map((d) => this.toDto(d)),
      total,
    };
  }

  async getById(id: number): Promise<DeptResponseDto> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) throw new NotFoundException(`Department #${id} not found`);
    return this.toDto(department);
  }

  async create(dto: CreateDepartmentRequestDto): Promise<DeptResponseDto> {
    const department = this.departmentRepository.create({ name: dto.name });
    const saved = await this.departmentRepository.save(department);
    return this.toDto(saved);
  }

  async update(
    id: number,
    dto: UpdateDepartmentRequestDto,
  ): Promise<DeptResponseDto> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) throw new NotFoundException(`Department #${id} not found`);

    if (dto.name !== undefined) department.name = dto.name;

    const saved = await this.departmentRepository.save(department);
    return this.toDto(saved);
  }

  async delete(id: number): Promise<void> {
    const department = await this.departmentRepository.findOne({
      where: { id },
    });
    if (!department) throw new NotFoundException(`Department #${id} not found`);
    await this.departmentRepository.remove(department);
  }
}
