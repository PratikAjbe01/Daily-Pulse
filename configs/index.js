import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon('postgresql://neondb_owner:npg_E3xhFeqj9Akf@ep-crimson-waterfall-a84ovbdv-pooler.eastus2.azure.neon.tech/dailyHabits?sslmode=require');
export const db = drizzle(sql );