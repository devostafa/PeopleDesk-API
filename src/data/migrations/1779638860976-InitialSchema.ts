import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1779638860976 implements MigrationInterface {
  name = 'InitialSchema1779638860976';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID(), "userName" nvarchar(255) NOT NULL, "password" nvarchar(255) NOT NULL, "role" nvarchar(50) NOT NULL CONSTRAINT "DF_6620cd026ee2b231beac7cfe578" DEFAULT 'user', CONSTRAINT "UQ_da5934070b5f2726ebfd3122c80" UNIQUE ("userName"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "department" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_9a2213262c1593bffb581e382f5" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_3c2bc72f03fd5abbbc5ac169498" DEFAULT NEWSEQUENTIALID(), "firstName" nvarchar(255) NOT NULL, "lastName" nvarchar(255) NOT NULL, "email" nvarchar(255) NOT NULL, "hireDate" date NOT NULL, "salary" decimal(10,2) NOT NULL, "departmentId" uniqueidentifier, CONSTRAINT "UQ_817d1d427138772d47eca048855" UNIQUE ("email"), CONSTRAINT "PK_3c2bc72f03fd5abbbc5ac169498" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_token" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_b575dd3c21fb0831013c909e7fe" DEFAULT NEWSEQUENTIALID(), "hashedToken" nvarchar(255) NOT NULL, "userId" uniqueidentifier NOT NULL, "expiresAt" datetime NOT NULL, "revoked" bit NOT NULL CONSTRAINT "DF_8ad962c903c72d82e7d4f29dbf7" DEFAULT 0, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e54266640b2a0ef53d507461f3" ON "refresh_token" ("userId", "revoked") `,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" ADD CONSTRAINT "FK_9ad20e4029f9458b6eed0b0c454" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`,
    );
    await queryRunner.query(
      `ALTER TABLE "employee" DROP CONSTRAINT "FK_9ad20e4029f9458b6eed0b0c454"`,
    );
    await queryRunner.query(
      `DROP INDEX "IDX_e54266640b2a0ef53d507461f3" ON "refresh_token"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_token"`);
    await queryRunner.query(`DROP TABLE "employee"`);
    await queryRunner.query(`DROP TABLE "department"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
