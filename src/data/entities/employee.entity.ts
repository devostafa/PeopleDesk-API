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

  @Column({ name: 'departmentId', type: 'uniqueidentifier', nullable: true })
  departmentId!: string | null;

  @ManyToOne(() => Department, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'departmentId' })
  department!: Department | null;
}
