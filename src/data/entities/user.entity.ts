import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../enums/userRole';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  userName!: string;

  @Column()
  password!: string;

  @Column({ type: 'nvarchar', length: 50, default: UserRole.USER })
  role!: UserRole;
}
