import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;
}
