# MongoDB Setup Guide

This guide will help you set up MongoDB for the FoloUp application.

## Prerequisites

- MongoDB installed locally or MongoDB Atlas account
- Node.js and npm/yarn installed

## Option 1: Local MongoDB Installation

### 1. Install MongoDB Community Edition

#### macOS (using Homebrew):
```bash
brew tap mongodb/brew
brew install mongodb-community
```

#### Ubuntu/Debian:
```bash
sudo apt-get install gnupg curl
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
```

#### Windows:
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### 2. Start MongoDB Service

#### macOS:
```bash
brew services start mongodb-community
```

#### Ubuntu/Debian:
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Windows:
MongoDB runs as a service automatically after installation.

### 3. Create Database and Collections

```bash
# Connect to MongoDB
mongosh

# Create database
use foloup

# Run the schema file
load("mongodb_schema.js")
```

## Option 2: MongoDB Atlas (Cloud)

### 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign up for a free account
3. Create a new cluster (free tier is sufficient)

### 2. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string

### 3. Configure Network Access
1. Go to Network Access
2. Add your IP address or `0.0.0.0/0` for all IPs

### 4. Create Database User
1. Go to Database Access
2. Create a new user with read/write permissions

## Environment Variables

Create a `.env.local` file in your project root:

```bash
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/foloup
MONGODB_DB_NAME=foloup

# For MongoDB Atlas, use:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/foloup?retryWrites=true&w=majority
# MONGODB_DB_NAME=foloup

# Other existing environment variables...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret
RETELL_API_KEY=your_retell_key
OPENAI_API_KEY=your_openai_key
```

## Install Dependencies

```bash
# Remove Supabase packages
npm uninstall @supabase/auth-helpers-nextjs @supabase/supabase-js

# Install MongoDB
npm install mongodb

# Or using yarn
yarn remove @supabase/auth-helpers-nextjs @supabase/supabase-js
yarn add mongodb
```

## Database Schema

The application uses the following collections:

- **organization**: Stores organization information and plans
- **user**: Stores user information linked to organizations
- **interviewer**: Stores AI interviewer configurations
- **interview**: Stores interview configurations and metadata
- **response**: Stores interview responses and analytics
- **feedback**: Stores user feedback

## Migration from Supabase

If you're migrating from Supabase:

1. Export your data from Supabase
2. Transform the data to match MongoDB schema
3. Import into MongoDB using `mongoimport` or MongoDB Compass
4. Update environment variables
5. Test the application

## Testing the Connection

You can test the MongoDB connection by running:

```bash
npm run dev
```

Check the console for any connection errors. If successful, you should see the application running without database errors.

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access (for Atlas)
- Check firewall settings

### Authentication Issues
- Verify username/password in connection string
- Check user permissions in MongoDB
- Ensure database exists

### Performance Issues
- Check if indexes are created properly
- Monitor query performance
- Consider connection pooling for production

## Support

For MongoDB-specific issues:
- [MongoDB Documentation](https://docs.mongodb.com/)
- [MongoDB Community Forums](https://community.mongodb.com/)
- [MongoDB Atlas Support](https://docs.atlas.mongodb.com/support/)
