import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1748131200000 implements MigrationInterface {
  name = 'InitialSchema1748131200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE [department] (
        [id]   UNIQUEIDENTIFIER DEFAULT NEWID() NOT NULL,
        [name] NVARCHAR(255)     NOT NULL,
        CONSTRAINT [PK_department] PRIMARY KEY ([id])
      )
    `);

    await queryRunner.query(`
      CREATE TABLE [employee] (
        [id]           UNIQUEIDENTIFIER DEFAULT NEWID() NOT NULL,
        [firstName]    NVARCHAR(255)     NOT NULL,
        [lastName]     NVARCHAR(255)     NOT NULL,
        [email]        NVARCHAR(255)     NOT NULL,
        [hireDate]     DATE              NOT NULL,
        [salary]       DECIMAL(10, 2)    NOT NULL,
        [departmentId] UNIQUEIDENTIFIER  NULL,
        CONSTRAINT [PK_employee]       PRIMARY KEY ([id]),
        CONSTRAINT [UQ_employee_email] UNIQUE      ([email]),
        CONSTRAINT [FK_employee_dept]  FOREIGN KEY ([departmentId])
          REFERENCES [department]([id]) ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE [user] (
        [id]       UNIQUEIDENTIFIER DEFAULT NEWID() NOT NULL,
        [userName] NVARCHAR(255)     NOT NULL,
        [password] NVARCHAR(255)     NOT NULL,
        [role]     NVARCHAR(50)      NOT NULL DEFAULT 'user',
        CONSTRAINT [PK_user]          PRIMARY KEY ([id]),
        CONSTRAINT [UQ_user_userName] UNIQUE      ([userName])
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE [employee] DROP CONSTRAINT [FK_employee_dept]`);
    await queryRunner.query(`DROP TABLE [user]`);
    await queryRunner.query(`DROP TABLE [employee]`);
    await queryRunner.query(`DROP TABLE [department]`);
  }
}
