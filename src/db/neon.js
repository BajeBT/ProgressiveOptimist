import { neon } from '@neondatabase/serverless';

// Neon Serverless PostgreSQL Connection String
export const NEON_DB_URL = "postgresql://neondb_owner:npg_g3Y2MVzbDSrn@ep-cold-bird-axj0in93-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";

// Export neon SQL query client
export const sql = neon(NEON_DB_URL);
