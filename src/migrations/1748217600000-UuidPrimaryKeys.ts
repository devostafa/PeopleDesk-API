import { MigrationInterface, QueryRunner } from 'typeorm';

export class UuidPrimaryKeys1748217600000 implements MigrationInterface {
  name = 'UuidPrimaryKeys1748217600000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Drop FK before altering employee table
    await queryRunner.query(`ALTER TABLE [employee] DROP CONSTRAINT [FK_employee_dept]`);

    // Recreate department table with UNIQUEIDENTIFIER PK
    await queryRunner.query(`DROP TABLE [department]`);
    await queryRunner.query(`
      CREATE TABLE [department] (
        [id]   UNIQUEIDENTIFIER DEFAULT NEWID() NOT NULL,
        [name] NVARCHAR(255)     NOT NULL,
        CONSTRAINT [PK_department] PRIMARY KEY ([id])
      )
    `);

    // Recreate employee table with UNIQUEIDENTIFIER PK and FK
    await queryRunner.query(`DROP TABLE [employee]`);
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

    // Recreate user table with UNIQUEIDENTIFIER PK
    await queryRunner.query(`DROP TABLE [user]`);
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
    // Drop FK before altering employee table
    await queryRunner.query(`ALTER TABLE [employee] DROP CONSTRAINT [FK_employee_dept]`);

    // Recreate department table with INT PK
    await queryRunner.query(`DROP TABLE [department]`);
    await queryRunner.query(`
      CREATE TABLE [department] (
        [id]   INT           IDENTITY(1,1) NOT NULL,
        [name] NVARCHAR(255) NOT NULL,
        CONSTRAINT [PK_department] PRIMARY KEY ([id])
      )
    `);

    // Recreate employee table with INT PK and FK
    await queryRunner.query(`DROP TABLE [employee]`);
    await queryRunner.query(`
      CREATE TABLE [employee] (
        [id]           INT           IDENTITY(1,1) NOT NULL,
        [firstName]    NVARCHAR(255) NOT NULL,
        [lastName]     NVARCHAR(255) NOT NULL,
        [email]        NVARCHAR(255) NOT NULL,
        [hireDate]     DATE          NOT NULL,
        [salary]       DECIMAL(10, 2) NOT NULL,
        [departmentId] INT           NULL,
        CONSTRAINT [PK_employee]       PRIMARY KEY ([id]),
        CONSTRAINT [UQ_employee_email] UNIQUE      ([email]),
        CONSTRAINT [FK_employee_dept]  FOREIGN KEY ([departmentId])
          REFERENCES [department]([id]) ON DELETE SET NULL
      )
    `);

    // Recreate user table with INT PK
    await queryRunner.query(`DROP TABLE [user]`);
    await queryRunner.query(`
      CREATE TABLE [user] (
        [id]       INT           IDENTITY(1,1) NOT NULL,
        [userName] NVARCHAR(255) NOT NULL,
        [password] NVARCHAR(255) NOT NULL,
        [role]     NVARCHAR(50)  NOT NULL DEFAULT 'user',
        CONSTRAINT [PK_user]          PRIMARY KEY ([id]),
        CONSTRAINT [UQ_user_userName] UNIQUE      ([userName])
      )
    `);
  }
}
