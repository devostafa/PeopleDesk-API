import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Department } from './department.entity';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ type: 'date' })
  hireDate!: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  salary!: number;

  @Column({ name: 'departmentId', type: 'uniqueidentifier' })
  departmentId!: string;

  @ManyToOne(() => Department, {
    eager: true,
    nullable: false,
    onDelete: 'NO ACTION',
  })
  @JoinColumn({ name: 'departmentId' })
  department!: Department;
}
