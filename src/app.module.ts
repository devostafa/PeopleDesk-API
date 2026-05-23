import { Module, OnModuleInit } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './controllers/authController';
import { EmployeeController } from './controllers/employeeController';
import { DepartmentController } from './controllers/departmentController';
import { AuthService } from './services/authService';
import { JwtService } from './services/jwtService';
import { HashService } from './services/hashService';
import { SeedService } from './services/seedService';
import { EmpService } from './services/empService';
import { DeptService } from './services/deptService';
import { DatabaseModule } from './data/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET', 'secret'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController, EmployeeController, DepartmentController],
  providers: [
    AuthService,
    JwtService,
    HashService,
    SeedService,
    EmpService,
    DeptService,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly seedService: SeedService) {}

  async onModuleInit(): Promise<void> {
    await this.seedService.seed();
  }
}
