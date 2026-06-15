import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import 'dotenv/config';

const migrationClient = postgres(process.env.DATABASE_URL as string, { max: 1 });

async function main() {
  console.log("Starting migration...");
  try {
    await migrate(drizzle(migrationClient), { migrationsFolder: "src/db/migrations" });
    console.log("Migration successful!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await migrationClient.end();
  }
}

main();
