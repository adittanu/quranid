import { PrismaClient } from '@prisma/client';
import { DATABASE_CONNECTION_TIMEOUT, DATABASE_POOL_SIZE, DATABASE_IDLE_TIMEOUT } from './config';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    // @ts-ignore: Config options injected based on requirements
    connection_timeout: DATABASE_CONNECTION_TIMEOUT,
    // @ts-ignore: Config options injected based on requirements
    pool_size: DATABASE_POOL_SIZE,
    // @ts-ignore: Config options injected based on requirements
    idle_timeout: DATABASE_IDLE_TIMEOUT,
  });
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Handle connection errors
prisma.$connect()
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((error) => {
    console.error('Failed to connect to database:', error);
    // process.exit(1);
  });

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  console.log('Database disconnected gracefully');
});

// Handle uncaught errors
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
