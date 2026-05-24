import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../data/entities/user.entity';
import { UserRole } from '../data/enums/userRole';
import { Employee } from '../data/entities/employee.entity';
import { Department } from '../data/entities/department.entity';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async seed(): Promise<void> {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      return;
    }

    // Create 3 departments
    const departments = await this.departmentRepository.save([
      this.departmentRepository.create({ name: 'Engineering' }),
      this.departmentRepository.create({ name: 'Human Resources' }),
      this.departmentRepository.create({ name: 'Marketing' }),
    ]);

    // Create 5 employees
    const employees = await this.employeeRepository.save([
      this.employeeRepository.create({
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice.johnson@company.com',
        hireDate: new Date('2021-03-15'),
        salary: 75000,
        department: departments[0],
      }),
      this.employeeRepository.create({
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob.smith@company.com',
        hireDate: new Date('2020-07-01'),
        salary: 68000,
        department: departments[0],
      }),
      this.employeeRepository.create({
        firstName: 'Carol',
        lastName: 'Williams',
        email: 'carol.williams@company.com',
        hireDate: new Date('2019-11-20'),
        salary: 62000,
        department: departments[1],
      }),
      this.employeeRepository.create({
        firstName: 'David',
        lastName: 'Brown',
        email: 'david.brown@company.com',
        hireDate: new Date('2022-01-10'),
        salary: 58000,
        department: departments[1],
      }),
      this.employeeRepository.create({
        firstName: 'Eva',
        lastName: 'Davis',
        email: 'eva.davis@company.com',
        hireDate: new Date('2023-05-22'),
        salary: 55000,
        department: departments[2],
      }),
    ]);

    const saltRounds = 10;

    // Create 1 admin user
    const adminPassword = await bcrypt.hash('admin123', saltRounds);
    await this.userRepository.save(
      this.userRepository.create({
        userName: 'admin',
        password: adminPassword,
        role: UserRole.ADMIN,
      }),
    );

    // Create 5 standard users linked to employees
    const standardPasswords = await Promise.all(
      employees.map(() => bcrypt.hash('password123', saltRounds)),
    );

    await this.userRepository.save(
      employees.map((employee, index) =>
        this.userRepository.create({
          userName: employee.email.split('@')[0],
          password: standardPasswords[index],
          role: UserRole.USER,
        }),
      ),
    );

    console.log('Database seeded successfully.');
  }
}
