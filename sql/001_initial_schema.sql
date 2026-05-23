-- ============================================================
-- People Desk - Initial Schema Migration
-- Target: SQL Server (MSSQL)
-- ============================================================

USE [people-desk];
GO

-- ------------------------------------------------------------
-- 1. department
-- ------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM sys.tables WHERE name = 'department'
)
BEGIN
  CREATE TABLE [dbo].[department] (
    [id]   INT IDENTITY(1,1) NOT NULL,
    [name] NVARCHAR(255)     NOT NULL,
    CONSTRAINT [PK_department] PRIMARY KEY CLUSTERED ([id])
  );
END
GO

-- ------------------------------------------------------------
-- 2. employee
-- ------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM sys.tables WHERE name = 'employee'
)
BEGIN
  CREATE TABLE [dbo].[employee] (
    [id]           INT IDENTITY(1,1) NOT NULL,
    [firstName]    NVARCHAR(255)     NOT NULL,
    [lastName]     NVARCHAR(255)     NOT NULL,
    [email]        NVARCHAR(255)     NOT NULL,
    [hireDate]     DATE              NOT NULL,
    [salary]       DECIMAL(10, 2)    NOT NULL,
    [departmentId] INT               NULL,
    CONSTRAINT [PK_employee]       PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_employee_email] UNIQUE ([email]),
    CONSTRAINT [FK_employee_dept]  FOREIGN KEY ([departmentId])
      REFERENCES [dbo].[department]([id])
      ON DELETE SET NULL
      ON UPDATE CASCADE
  );
END
GO

-- ------------------------------------------------------------
-- 3. user
-- ------------------------------------------------------------
IF NOT EXISTS (
  SELECT 1 FROM sys.tables WHERE name = 'user'
)
BEGIN
  CREATE TABLE [dbo].[user] (
    [id]         INT IDENTITY(1,1) NOT NULL,
    [userName]   NVARCHAR(255)     NOT NULL,
    [password]   NVARCHAR(255)     NOT NULL,
    [role]       NVARCHAR(50)      NOT NULL
                   CONSTRAINT [DF_user_role] DEFAULT 'standard',
    [employeeId] INT               NULL,
    CONSTRAINT [PK_user]          PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UQ_user_userName] UNIQUE ([userName]),
    CONSTRAINT [CK_user_role]     CHECK ([role] IN ('admin', 'standard')),
    CONSTRAINT [FK_user_employee] FOREIGN KEY ([employeeId])
      REFERENCES [dbo].[employee]([id])
      ON DELETE SET NULL
      ON UPDATE CASCADE
  );
END
GO

-- ============================================================
-- Rollback script (run manually to undo migration)
-- ============================================================
-- ALTER TABLE [dbo].[user]     DROP CONSTRAINT [FK_user_employee];
-- ALTER TABLE [dbo].[employee] DROP CONSTRAINT [FK_employee_dept];
-- DROP TABLE [dbo].[user];
-- DROP TABLE [dbo].[employee];
-- DROP TABLE [dbo].[department];
