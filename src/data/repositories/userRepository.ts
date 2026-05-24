import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOneOptions, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
  ) {}

  async findOne(options: FindOneOptions<User>): Promise<User | null> {
    return this.repository.findOne(options);
  }

  create(entityLike: DeepPartial<User>): User {
    return this.repository.create(entityLike);
  }

  async save(entity: User): Promise<User> {
    return this.repository.save(entity);
  }
}
