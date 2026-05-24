# PeopleDesk API
This is the API for PeopleDesk system built on NestJS

# Installation
Run `npm install` to install dependencies

# Database Configuration
- Ensure to have SQL Server running on port 1433 and peopledesk database created.
- Ensure SQL Server is running in mixed mode authentication.
- Configure userName and password credentials in the .env file.

## Database Migrations
- The command typically follows the format: `npm run migration:generate <migration-name>`

# Running the server
- Run `npm start` to start the server