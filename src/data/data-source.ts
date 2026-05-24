import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { Employee } from './entities/employee.entity';
import { Department } from './entities/department.entity';
import { RefreshToken } from './entities/refreshToken.entity';
import * as dotenv from 'dotenv';

dotenv.config();

// Used for TypeORM's CLI for migrations
export default new DataSource({
  type: 'mssql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '1433', 10),
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'peopledesk',
  entities: [User, Employee, Department, RefreshToken],
  migrations: ['src/data/migrations/*.ts'],
  options: {
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
});
