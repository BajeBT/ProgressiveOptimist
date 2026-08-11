import { neon } from '@neondatabase/serverless';

const NEON_DB_URL = "postgresql://neondb_owner:npg_g3Y2MVzbDSrn@ep-cold-bird-axj0in93-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require";
const sql = neon(NEON_DB_URL);

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`Google token refresh failed: ${data.error_description || data.error || res.status}`);
  }
  return data.access_token;
}

function chunk(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  try {
    const rows = await sql`
      SELECT id, title, caption, uploader, google_media_item_id, posted_at
      FROM gallery
      ORDER BY posted_at DESC, created_at DESC;
    `;

    if (rows.length === 0) {
      return res.status(200).json({ success: true, photos: [] });
    }

    const missingEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']
      .filter(k => !process.env[k] || process.env[k].startsWith('REPLACE_ME'));
    if (missingEnv.length > 0) {
      // Not configured yet - fail soft so the rest of the portal keeps working.
      return res.status(200).json({ success: true, photos: [] });
    }

    const accessToken = await getAccessToken();

    // Google's baseUrls expire (~1hr), so every list request needs fresh ones.
    // batchGet takes up to 50 ids per call.
    const baseUrlById = {};
    for (const batch of chunk(rows, 50)) {
      const params = new URLSearchParams();
      batch.forEach(r => params.append('mediaItemIds', r.google_media_item_id));
      const batchRes = await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems:batchGet?${params.toString()}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const batchData = await batchRes.json();
      if (!batchRes.ok) {
        console.error('gallery-list batchGet error:', batchData);
        continue;
      }
      (batchData.mediaItemResults || []).forEach(r => {
        if (r.mediaItem) baseUrlById[r.mediaItem.id] = r.mediaItem.baseUrl;
      });
    }

    // Rows whose Google media item is gone (e.g. deleted directly in Photos)
    // are skipped rather than shown broken.
    const photos = rows
      .filter(r => baseUrlById[r.google_media_item_id])
      .map(r => ({
        id: r.id,
        title: r.title,
        caption: r.caption,
        uploader: r.uploader,
        date: r.posted_at,
        image: `${baseUrlById[r.google_media_item_id]}=w800-h800-c`
      }));

    return res.status(200).json({ success: true, photos });
  } catch (err) {
    console.error('gallery-list error:', err);
    return res.status(500).json({ success: false, message: 'Failed to load photo gallery.' });
  }
}
