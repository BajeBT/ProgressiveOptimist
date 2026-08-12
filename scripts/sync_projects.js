import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { initialProjects } from '../src/data/projectsData.js';


const sql = neon(process.env.NEON_DATABASE_URL);

// Pushes src/data/projectsData.js (the canonical project list, transcribed from
// the live site progressiveoptimist.org) into Neon.
//
// Non-destructive by design: upserts by id and never deletes. Projects submitted
// through the member portal are not in initialProjects, so they are left alone.
async function syncProjects() {
  console.log(`Syncing ${initialProjects.length} projects to Neon...`);

  await sql`ALTER TABLE projects ADD COLUMN IF NOT EXISTS flyer_url TEXT;`;

  let inserted = 0;
  let updated = 0;

  for (const p of initialProjects) {
    const existing = await sql`SELECT id FROM projects WHERE id = ${p.id};`;

    await sql`
      INSERT INTO projects (
        id, title, category, date_str, image, flyer_url, excerpt, content,
        impact, is_featured, author, author_id, posted_at, children_served, approved
      )
      VALUES (
        ${p.id}, ${p.title}, ${p.category}, ${p.date}, ${p.image}, ${p.flyerUrl || null},
        ${p.excerpt}, ${p.content}, ${p.impact}, ${Boolean(p.isFeatured)},
        ${p.author}, ${p.authorId || null}, ${p.postedAt}, ${p.childrenServed || 0}, TRUE
      )
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        date_str = EXCLUDED.date_str,
        image = EXCLUDED.image,
        flyer_url = EXCLUDED.flyer_url,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        impact = EXCLUDED.impact,
        is_featured = EXCLUDED.is_featured,
        author = EXCLUDED.author,
        author_id = EXCLUDED.author_id,
        posted_at = EXCLUDED.posted_at,
        children_served = EXCLUDED.children_served;
    `;

    if (existing.length > 0) updated++; else inserted++;
  }

  console.log(`Inserted ${inserted}, updated ${updated}.`);

  const total = await sql`SELECT COUNT(*)::int AS n FROM projects;`;
  const noFlyer = await sql`SELECT COUNT(*)::int AS n FROM projects WHERE flyer_url IS NULL OR flyer_url = '';`;
  const extra = await sql`
    SELECT id, title, author FROM projects
    WHERE id <> ALL(${initialProjects.map(p => p.id)})
    ORDER BY posted_at DESC;
  `;

  console.log(`\nprojects table now holds ${total[0].n} row(s); ${noFlyer[0].n} without a flyer.`);
  if (extra.length > 0) {
    console.log(`${extra.length} row(s) not in projectsData.js (portal submissions, left untouched):`);
    extra.forEach(r => console.log(`  - ${r.id} (${r.title}) by ${r.author}`));
  } else {
    console.log("No portal-submitted projects present.");
  }
}

syncProjects().catch(err => {
  console.error("Sync failed:", err);
  process.exit(1);
});
