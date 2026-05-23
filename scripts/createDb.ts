import * as sql from 'mssql';
import * as dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.APP_DB_NAME || 'NestAppDB';
const MASTER_DB = 'master';

// SQL Server requires a connection to `master` to create new databases
const config: sql.config = {
  server: process.env.DB_SERVER || 'localhost',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'admin',
      password: process.env.DB_PASSWORD || 'admin',
    },
  },
  options: {
    database: MASTER_DB,
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function createDatabase() {
  let pool: sql.ConnectionPool | null = null;

  try {
    pool = await sql.connect(config);
    console.log(`✅ Connected to ${MASTER_DB} database`);

    const query = `
      IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = @dbName)
      BEGIN
        DECLARE @sql NVARCHAR(MAX) = 'CREATE DATABASE ' + QUOTENAME(@dbName);
        EXEC sp_executesql @sql;
        PRINT 'Database created successfully.';
      END
      ELSE
      BEGIN
        PRINT 'Database already exists. Skipping.';
      END
    `;

    await pool.request().input('dbName', sql.NVarChar, DB_NAME).query(query);

    console.log(`Database '${DB_NAME}' setup complete.`);
  } catch (error: any) {
    console.error('Failed to create database:', error.message);
    process.exit(1);
  } finally {
    if (pool) await pool.close();
    process.exit(0);
  }
}

createDatabase();
