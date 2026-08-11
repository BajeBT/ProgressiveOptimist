import { neon } from '@neondatabase/serverless';

const NEON_DB_URL = "postgresql://neondb_owner:npg_g3Y2MVzbDSrn@ep-cold-bird-axj0in93-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(NEON_DB_URL);

// Makes children_served mandatory at the data layer so the homepage
// "Children Reached" total can never be broken by a NULL.
// Existing rows keep their current value (all seeded rows are 0).
async function migrate() {
  const nulls = await sql`SELECT COUNT(*)::int AS n FROM projects WHERE children_served IS NULL;`;
  console.log(`Rows with NULL children_served: ${nulls[0].n}`);

  if (nulls[0].n > 0) {
    await sql`UPDATE projects SET children_served = 0 WHERE children_served IS NULL;`;
    console.log("Backfilled NULLs to 0.");
  }

  await sql`ALTER TABLE projects ALTER COLUMN children_served SET NOT NULL;`;
  await sql`ALTER TABLE projects ALTER COLUMN children_served SET DEFAULT 0;`;
  console.log("children_served is now NOT NULL.");

  const check = await sql`
    SELECT is_nullable, column_default
    FROM information_schema.columns
    WHERE table_name = 'projects' AND column_name = 'children_served';
  `;
  console.log("Verified:", check[0]);

  const total = await sql`SELECT COALESCE(SUM(children_served), 0)::int AS n FROM projects WHERE approved IS NOT FALSE;`;
  console.log(`Current sum of children_served across approved projects: ${total[0].n}`);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
