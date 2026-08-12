import 'dotenv/config';
import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.NEON_DATABASE_URL);

// Admin-editable options for the Contact page's "Subject" dropdown. Seeded
// with the current hardcoded values so nothing changes visibly on deploy.
const defaultSubjects = [
  "General Inquiry",
  "Membership Application",
  "Volunteering Opportunities",
  "Laptop & Tablet Drive"
];

async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_subjects (
      id SERIAL PRIMARY KEY,
      label TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("contact_subjects table ready.");

  const count = await sql`SELECT COUNT(*)::int AS n FROM contact_subjects;`;
  if (count[0].n === 0) {
    for (let i = 0; i < defaultSubjects.length; i++) {
      await sql`INSERT INTO contact_subjects (label, sort_order) VALUES (${defaultSubjects[i]}, ${i});`;
    }
    console.log(`Seeded ${defaultSubjects.length} default subject(s).`);
  } else {
    console.log(`Table already has ${count[0].n} row(s), skipped seeding.`);
  }
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
