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

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const missingEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']
    .filter(k => !process.env[k] || process.env[k].startsWith('REPLACE_ME'));
  if (missingEnv.length > 0) {
    return res.status(500).json({ success: false, message: 'Google Photos is not configured yet.' });
  }

  const { title, caption, imageBase64, uploaderName, uploaderId } = req.body || {};

  if (!title || !imageBase64 || !uploaderName) {
    return res.status(400).json({ success: false, message: 'Title, image, and uploader name are required.' });
  }

  const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(imageBase64);
  if (!match) {
    return res.status(400).json({ success: false, message: 'Image must be a JPEG, PNG, WEBP, or GIF file.' });
  }

  try {
    const accessToken = await getAccessToken();
    const mimeType = match[1];
    const bytes = Buffer.from(match[2], 'base64');

    // Step 1: upload raw bytes, get back a short-lived upload token
    const uploadRes = await fetch('https://photoslibrary.googleapis.com/v1/uploads', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/octet-stream',
        'X-Goog-Upload-Content-Type': mimeType,
        'X-Goog-Upload-Protocol': 'raw'
      },
      body: bytes
    });
    const uploadToken = await uploadRes.text();
    if (!uploadRes.ok) {
      throw new Error(`Google Photos upload failed: ${uploadToken}`);
    }

    // Step 2: turn the uploaded bytes into an actual media item
    const createRes = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        newMediaItems: [{
          description: String(title).slice(0, 500),
          simpleMediaItem: { uploadToken }
        }]
      })
    });
    const createData = await createRes.json();
    const result = createData?.newMediaItemResults?.[0];
    if (!createRes.ok || !result || result.status?.message !== 'Success' || !result.mediaItem) {
      throw new Error(`Google Photos media item creation failed: ${result?.status?.message || createRes.status}`);
    }

    const mediaItem = result.mediaItem;
    const id = 'g-' + Date.now();
    const postedAt = new Date().toISOString().split('T')[0];

    await sql`
      INSERT INTO gallery (id, title, caption, uploader, uploader_id, google_media_item_id, posted_at)
      VALUES (${id}, ${title}, ${caption || ''}, ${uploaderName}, ${uploaderId || null}, ${mediaItem.id}, ${postedAt});
    `;

    // batchCreate's own response can return baseUrl unpopulated for an item
    // that was *just* created, even though the id is already valid - fetch it
    // fresh so the client never gets shown a broken/missing image.
    let baseUrl = mediaItem.baseUrl;
    if (!baseUrl) {
      const getRes = await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems/${mediaItem.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const getData = await getRes.json();
      baseUrl = getData?.baseUrl;
    }

    return res.status(200).json({
      success: true,
      photo: {
        id,
        title,
        caption: caption || '',
        uploader: uploaderName,
        date: postedAt,
        image: baseUrl ? `${baseUrl}=w800-h800-c` : null
      }
    });
  } catch (err) {
    console.error('gallery-upload error:', err);
    return res.status(500).json({ success: false, message: 'Failed to upload photo to Google Photos. Please try again.' });
  }
}
