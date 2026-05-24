import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshTokenTable1748304000000 implements MigrationInterface {
  name = 'AddRefreshTokenTable1748304000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE [refresh_token] (
        [id]           UNIQUEIDENTIFIER DEFAULT NEWID() NOT NULL,
        [hashedToken]  NVARCHAR(255)    NOT NULL,
        [userId]       UNIQUEIDENTIFIER NOT NULL,
        [expiresAt]    DATETIME         NOT NULL,
        [revoked]      BIT              NOT NULL DEFAULT 0,
        CONSTRAINT [PK_refresh_token] PRIMARY KEY ([id])
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE [refresh_token]`);
  }
}
