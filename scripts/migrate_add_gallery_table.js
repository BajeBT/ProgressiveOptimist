import 'dotenv/config';
import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.NEON_DATABASE_URL);

// Creates the gallery table. Stores only metadata - never image bytes or Google's
// baseUrls, which expire after ~1 hour. api/gallery-list.js fetches a fresh
// baseUrl for each row's google_media_item_id at read time.
async function migrate() {
  await sql`
    CREATE TABLE IF NOT EXISTS gallery (
      id VARCHAR(50) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      caption TEXT,
      uploader VARCHAR(255) NOT NULL,
      uploader_id VARCHAR(50),
      google_media_item_id TEXT NOT NULL,
      posted_at VARCHAR(50) NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log("gallery table ready.");

  const count = await sql`SELECT COUNT(*)::int AS n FROM gallery;`;
  console.log(`Current row count: ${count[0].n}`);
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
