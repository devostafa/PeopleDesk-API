import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  hashedToken!: string;

  @Column()
  userId!: string;

  @Column()
  expiresAt!: Date;

  @Column({ default: false })
  revoked!: boolean;
}
