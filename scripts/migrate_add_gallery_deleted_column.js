import 'dotenv/config';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL);

// Google Photos Library API has no endpoint to delete a media item, so
// "deleting" a website-uploaded photo can only ever hide it from our own
// listing. This adds a deleted_media_ids table that records the
// google_media_item_id of anything a user deletes; api/gallery.js filters
// those IDs out of the live Google Photos list on every GET, so the photo
// stays hidden even though it still physically exists in Google Photos.
async function migrate() {
  if (!process.env.NEON_DATABASE_URL) {
    throw new Error('NEON_DATABASE_URL is not set. Add it to .env before running this migration.');
  }

  console.log('Creating deleted_media_ids table...');
  await sql`
    CREATE TABLE IF NOT EXISTS deleted_media_ids (
      google_media_item_id TEXT PRIMARY KEY,
      deleted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('deleted_media_ids table ready.');

  const count = await sql`SELECT COUNT(*)::int AS n FROM deleted_media_ids;`;
  console.log(`Current row count: ${count[0].n}`);
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
