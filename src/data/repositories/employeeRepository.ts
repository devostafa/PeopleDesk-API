import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Employee } from '../entities/employee';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(Employee)
    private readonly repository: Repository<Employee>,
  ) {}

  async findAndCount(options?: FindManyOptions<Employee>) {
    return this.repository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<Employee>) {
    return this.repository.findOne(options);
  }

  create(entityLike: DeepPartial<Employee>) {
    return this.repository.create(entityLike);
  }

  async save(entity: Employee) {
    return this.repository.save(entity);
  }

  async remove(entity: Employee) {
    return this.repository.remove(entity);
  }
}
