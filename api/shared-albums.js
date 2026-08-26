import { sql, requireDatabase, ensureSharedAlbums } from '../lib/db.js';
import { requireAccess } from '../lib/session.js';

const CAN_EDIT = ['super admin', 'finance', 'admin'];

// The albums the gallery shipped with. They lived in the client and in each
// member's localStorage, so an album one officer added was invisible to
// everyone else. Seeded once so nothing is lost in the move to the database.
const SEED_ALBUMS = [
  { title: 'Highlights4Website', url: 'https://photos.app.goo.gl/sbLWaXTv6uEHsFtS8' },
  { title: '2026 CIBC', url: 'https://photos.app.goo.gl/wRpDe4Li5XqTW16V6' },
  { title: 'RISE 2025 Closing Ceremony', url: 'https://photos.app.goo.gl/SJFzS37o9MxsHSri9' }
];

async function seedIfEmpty() {
  const existing = await sql`SELECT COUNT(*) AS c FROM shared_albums;`;
  if (Number(existing[0].c) > 0) return;

  for (let i = 0; i < SEED_ALBUMS.length; i++) {
    const album = SEED_ALBUMS[i];
    await sql`
      INSERT INTO shared_albums (title, url, sort_order, created_by)
      VALUES (${album.title}, ${album.url}, ${i}, 'seed')
      ON CONFLICT (url) DO NOTHING;
    `;
  }
}

function toClientShape(row) {
  return {
    id: String(row.id),
    title: row.title,
    url: row.url
  };
}

async function handleList(req, res) {
  await seedIfEmpty();
  const rows = await sql`SELECT * FROM shared_albums ORDER BY sort_order ASC, created_at ASC;`;
  return res.status(200).json({ success: true, albums: rows.map(toClientShape) });
}

async function handleAdd(req, res, session) {
  const title = String(req.body?.title || '').trim();
  const url = String(req.body?.url || '').trim();

  if (!title || !url) {
    return res.status(400).json({ success: false, message: 'An album title and shared link are required.' });
  }
  if (!/^https:\/\/photos\.app\.goo\.gl\/|^https:\/\/photos\.google\.com\//.test(url)) {
    return res.status(400).json({
      success: false,
      message: 'Please enter a Google Photos shared album link (https://photos.app.goo.gl/...).'
    });
  }

  const duplicate = await sql`SELECT id FROM shared_albums WHERE url = ${url} LIMIT 1;`;
  if (duplicate.length > 0) {
    return res.status(409).json({ success: false, message: 'That album is already in the list.' });
  }

  const maxOrder = await sql`SELECT COALESCE(MAX(sort_order), -1) AS max FROM shared_albums;`;
  const rows = await sql`
    INSERT INTO shared_albums (title, url, sort_order, created_by)
    VALUES (${title}, ${url}, ${Number(maxOrder[0].max) + 1}, ${session.memberId})
    RETURNING *;
  `;
  return res.status(200).json({ success: true, album: toClientShape(rows[0]), message: `"${title}" added to the gallery.` });
}

async function handleUpdate(req, res) {
  const { id, title, url } = req.body || {};
  if (!id) {
    return res.status(400).json({ success: false, message: 'An album id is required.' });
  }

  const rows = await sql`
    UPDATE shared_albums
    SET title = COALESCE(${title ? String(title).trim() : null}, title),
        url = COALESCE(${url ? String(url).trim() : null}, url)
    WHERE id = ${id}
    RETURNING *;
  `;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'That album no longer exists.' });
  }
  return res.status(200).json({ success: true, album: toClientShape(rows[0]) });
}

async function handleDelete(req, res) {
  const id = req.body?.id;
  if (!id) {
    return res.status(400).json({ success: false, message: 'An album id is required.' });
  }

  const rows = await sql`DELETE FROM shared_albums WHERE id = ${id} RETURNING title;`;
  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'That album no longer exists.' });
  }
  return res.status(200).json({ success: true, message: `"${rows[0].title}" removed from the gallery.` });
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;
  await ensureSharedAlbums();

  try {
    // The gallery reads this list on load; the writes below are what need an
    // officer's session.
    if (req.method === 'GET') {
      return await handleList(req, res);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const session = requireAccess(req, res, CAN_EDIT);
    if (!session) return;

    const { action } = req.body || {};

    switch (action) {
      case 'add':
        return await handleAdd(req, res, session);
      case 'update':
        return await handleUpdate(req, res);
      case 'delete':
        return await handleDelete(req, res);
      default:
        return res.status(400).json({ success: false, message: 'Unknown action.' });
    }
  } catch (err) {
    console.error(`shared-albums (${req.method} ${req.body?.action || 'list'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
