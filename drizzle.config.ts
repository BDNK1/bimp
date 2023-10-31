import type { Config } from 'drizzle-kit';
import 'dotenv/config';

export default {
  schema: './src/common/db/schema.ts',
  out: './db-changelog',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
  driver: 'pg',
} satisfies Config;
