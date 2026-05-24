import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './repositories/userRepository';
import { EmployeeRepository } from './repositories/employeeRepository';
import { DepartmentRepository } from './repositories/departmentRepository';
import { RefreshTokenRepository } from './repositories/refreshTokenRepository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mssql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: parseInt(configService.get<string>('DB_PORT') || '1433', 10),
        username: configService.get<string>('DB_USERNAME', 'admin'),
        password: configService.get<string>('DB_PASSWORD', 'admin'),
        database: configService.get<string>('DB_NAME', 'peopledesk'),
        entities: [User, Employee, Department, RefreshToken],
        synchronize: false,
        migrations: ['dist/data/migrations/*.js'],
        migrationsRun: true,
        options: {
          encrypt: false,
          enableArithAbort: true,
          trustServerCertificate: true,
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Employee, Department, RefreshToken]),
  ],
  providers: [
    UserRepository,
    EmployeeRepository,
    DepartmentRepository,
    RefreshTokenRepository,
  ],
  exports: [
    TypeOrmModule,
    UserRepository,
    EmployeeRepository,
    DepartmentRepository,
    RefreshTokenRepository,
  ],
})
export class DatabaseModule {}
