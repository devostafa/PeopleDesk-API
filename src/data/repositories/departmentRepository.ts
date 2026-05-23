import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository,
} from 'typeorm';
import { Department } from '../entities/department';

@Injectable()
export class DepartmentRepository {
  constructor(
    @InjectRepository(Department)
    private readonly repository: Repository<Department>,
  ) {}

  async findAndCount(options?: FindManyOptions<Department>) {
    return this.repository.findAndCount(options);
  }

  async findOne(options: FindOneOptions<Department>) {
    return this.repository.findOne(options);
  }

  create(entityLike: DeepPartial<Department>) {
    return this.repository.create(entityLike);
  }

  async save(entity: Department) {
    return this.repository.save(entity);
  }

  async remove(entity: Department) {
    return this.repository.remove(entity);
  }
}
