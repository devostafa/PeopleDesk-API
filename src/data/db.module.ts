import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user';
import { Employee } from './entities/employee';
import { Department } from './entities/department';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from './repositories/userRepository';
import { EmployeeRepository } from './repositories/employeeRepository';
import { DepartmentRepository } from './repositories/departmentRepository';

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
        entities: [User, Employee, Department],
        synchronize: false,
        migrations: ['dist/**/migrations/*.js'],
        migrationsRun: true,
        options: {
          encrypt: false,
          enableArithAbort: true,
          trustServerCertificate: true,
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Employee, Department]),
  ],
  providers: [UserRepository, EmployeeRepository, DepartmentRepository],
  exports: [
    TypeOrmModule,
    UserRepository,
    EmployeeRepository,
    DepartmentRepository,
  ],
})
export class DatabaseModule {}
