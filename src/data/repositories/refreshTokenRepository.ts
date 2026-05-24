import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';
import { RefreshToken } from '../entities/refreshToken.entity';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly repository: Repository<RefreshToken>,
  ) {}

  async findAll(
    options?: FindManyOptions<RefreshToken>,
  ): Promise<RefreshToken[]> {
    return this.repository.find(options);
  }

  async findOne(
    options: FindOneOptions<RefreshToken>,
  ): Promise<RefreshToken | null> {
    return this.repository.findOne(options);
  }

  create(entityLike: DeepPartial<RefreshToken>): RefreshToken {
    return this.repository.create(entityLike);
  }

  async save(entityLike: DeepPartial<RefreshToken>): Promise<RefreshToken> {
    const entity = this.repository.create(entityLike);
    return this.repository.save(entity);
  }

  async update(
    where: string | FindOptionsWhere<RefreshToken>,
    partial: DeepPartial<RefreshToken>,
  ): Promise<void> {
    await this.repository.update(where, partial);
  }

  async remove(entity: RefreshToken): Promise<RefreshToken> {
    return this.repository.remove(entity);
  }
}
