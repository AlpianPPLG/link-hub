# Database Schema

This document describes the database structure and relationships for Link Hub.

## Tables

### Users
Stores user account information.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | String | User's full name |
| email | String | Unique email address |
| password | String | Hashed password |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Links
Stores URL links created by users.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| url | String | The actual URL |
| title | String | Link title |
| description | Text | Optional description |
| userId | UUID | Foreign key to Users |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Tags
Categories for organizing links.

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| name | String | Tag name |
| userId | UUID | Foreign key to Users |
| createdAt | DateTime | Creation timestamp |

### LinkTags
Junction table for many-to-many relationship between Links and Tags.

| Column | Type | Description |
|--------|------|-------------|
| linkId | UUID | Foreign key to Links |
| tagId | UUID | Foreign key to Tags |
| createdAt | DateTime | Creation timestamp |

## Relationships

- One User has many Links (1:N)
- One User has many Tags (1:N)
- Many Links can have many Tags (M:N) through LinkTags

## Indexes

- Users.email: Unique index
- Links.url: Index for faster lookups
- Tags.name: Index for faster searches
- LinkTags(linkId, tagId): Composite primary key

## Migrations

To create a new migration:

```bash
npx prisma migrate dev --name your_migration_name
```

To apply pending migrations:

```bash
npx prisma migrate deploy
```

## Seeding the Database

To seed the database with initial data, run:

```bash
npx prisma db seed
```

## Prisma Schema

The database is managed using Prisma. The schema can be found in `prisma/schema.prisma`.

## Backup and Recovery

### Create Backup
```bash
pg_dump -U username -d dbname > backup.sql
```

### Restore from Backup
```bash
psql -U username -d dbname < backup.sql
```
