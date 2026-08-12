import 'dotenv/config';
import { neon } from '@neondatabase/serverless';


const sql = neon(process.env.NEON_DATABASE_URL);

// Flyer URLs sourced from the live site progressiveoptimist.org (authoritative),
// via its WordPress REST API featured-media records.
const flyerUrls = {
  "rise-2025-summer": "https://progressiveoptimist.org/wp/wp-content/uploads/2025/05/RISE-Teens-Flyer.jpg",
  "2025-easter-cheer": "https://progressiveoptimist.org/wp/wp-content/uploads/2025/04/2025-Easter-Cheer-1.jpg",
  "rise-challenge": "https://progressiveoptimist.org/wp/wp-content/uploads/2025/04/RISE-Flyer.jpg",
  "volunteers-june-2024": "https://progressiveoptimist.org/wp/wp-content/uploads/2024/06/JuneVolunteers.jpg",
  "trivia-night-2023": "https://progressiveoptimist.org/wp/wp-content/uploads/2023/05/TriviaNight-Jun2023.jpg",
  "mini-millionaires-2022": "https://progressiveoptimist.org/wp/wp-content/uploads/2022/06/Mini.jpg",
  "healthy-eating-westbury": "https://progressiveoptimist.org/wp/wp-content/uploads/2022/04/Produce-Donation-at-Westbury-Primary-1-0.jpeg",
  "easter-cheer-ignatius-byer": "https://progressiveoptimist.org/wp/wp-content/uploads/2022/04/Kite-Donation-7-0.jpeg",
  "ignatius-byer-stem-books": "https://progressiveoptimist.org/wp/wp-content/uploads/2022/03/Ignatius-Byer-Donation-6-0.jpg",
  "tree-planting-zone9": "https://progressiveoptimist.org/wp/wp-content/uploads/2022/03/POCB-Tree-Planting-1-0.jpeg",
  "christmas-charm-outreach-2021": "https://progressiveoptimist.org/wp/wp-content/uploads/2022/03/2021-Christmas-Cheer.png",
  "karaoke-bingo-2020": "https://progressiveoptimist.org/wp/wp-content/uploads/2020/04/bingo-2020-0.jpeg"
};

// karaoke-bingo-2020 was seeded with an Unsplash stock placeholder. The live site
// carries the club's own photo, so replace it.
const imageCorrections = {
  "karaoke-bingo-2020": "https://progressiveoptimist.org/wp/wp-content/uploads/2020/04/bingo-2020-0.jpeg"
};

async function migrate() {
  console.log("Connecting to Neon...");

  // 1. Additive schema change - safe to re-run, never drops data.
  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS flyer_url TEXT;`;
  console.log("Column 'flyer_url' present on projects.");

  // 2. Targeted per-row backfill. Only touches ids listed above; any project
  //    submitted through the portal is left untouched.
  let updated = 0;
  let missing = [];
  for (const [id, url] of Object.entries(flyerUrls)) {
    const res = await sql`
      UPDATE projects
      SET flyer_url = ${url}
      WHERE id = ${id}
      RETURNING id;
    `;
    if (res.length > 0) {
      updated++;
    } else {
      missing.push(id);
    }
  }
  console.log(`Backfilled flyer_url on ${updated} project(s).`);
  if (missing.length > 0) {
    console.warn("No matching row for:", missing.join(', '));
  }

  // 3. Replace stock placeholder imagery with the authoritative club photo.
  for (const [id, url] of Object.entries(imageCorrections)) {
    const res = await sql`
      UPDATE projects
      SET image = ${url}
      WHERE id = ${id}
      RETURNING id;
    `;
    if (res.length > 0) console.log(`Corrected image for '${id}'.`);
  }

  // 4. Report anything still without a flyer so gaps stay visible.
  const remaining = await sql`
    SELECT id, title FROM projects
    WHERE flyer_url IS NULL OR flyer_url = ''
    ORDER BY posted_at DESC;
  `;
  if (remaining.length === 0) {
    console.log("Every project now has a flyer_url.");
  } else {
    console.log(`\n${remaining.length} project(s) still without a flyer:`);
    remaining.forEach(r => console.log(`  - ${r.id} (${r.title})`));
  }

  console.log("\nMigration complete.");
}

migrate().catch(err => {
  console.error("Migration failed:", err);
  process.exit(1);
});
