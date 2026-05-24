import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { Employee } from '../entities/employee.entity';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  async findAndCount(
    options?: FindManyOptions<Employee>,
  ): Promise<[Employee[], number]> {
    return this.repository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<Employee>): Promise<Employee | null> {
    return this.repository.findOne(options);
  }

  create(entityLike: DeepPartial<Employee>): Employee {
    return this.repository.create(entityLike);
  }

  async save(entity: Employee): Promise<Employee> {
    return this.repository.save(entity);
  }

  async count(where?: FindOptionsWhere<Employee>): Promise<number> {
    return this.repository.count({ where });
  }

  async remove(entity: Employee): Promise<Employee> {
    return this.repository.remove(entity);
  }
}
