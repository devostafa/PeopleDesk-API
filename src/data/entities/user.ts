import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Employee } from './employee';
import { UserRole } from '../enums/userRole';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userName: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STANDARD })
  role: UserRole;

  @OneToOne(() => Employee, { nullable: true, eager: true })
  @JoinColumn()
  employee: Employee;
}
