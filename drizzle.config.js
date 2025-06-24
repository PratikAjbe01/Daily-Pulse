
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './configs/schema.js',
  dialect: 'postgresql',
  dbCredentials: {
    url:'postgresql://neondb_owner:npg_E3xhFeqj9Akf@ep-crimson-waterfall-a84ovbdv-pooler.eastus2.azure.neon.tech/dailyHabits?sslmode=require',
  },
});
