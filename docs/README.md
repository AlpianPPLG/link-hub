# Link Hub Documentation

Welcome to the official documentation for Link Hub, a powerful link management platform.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites
- Node.js 16+ and npm 8+
- PostgreSQL 12+
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/link-hub.git
cd link-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run database migrations
npx prisma migrate dev
```

### Configuration

Edit the `.env.local` file with your configuration:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/linkhub"
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

## API Reference

Detailed API documentation is available in [API.md](./api/API.md).

## Database Schema

For database schema details, see [DATABASE.md](./database/DATABASE.md).

## Deployment

See [DEPLOYMENT.md](./deployment/DEPLOYMENT.md) for deployment instructions.

## Contributing

Contributions are welcome! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
