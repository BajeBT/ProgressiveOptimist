import { sql } from '../lib/db.js';
import { getSession } from '../lib/session.js';

const CAN_MODERATE_GALLERY = ['super admin', 'admin', 'finance'];

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

async function fetchSharedAlbumPhotos(albumUrl) {
  if (!albumUrl || typeof albumUrl !== 'string' || !albumUrl.startsWith('http')) {
    return [];
  }
  try {
    const res = await fetch(albumUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    if (!res.ok) return [];
    const html = await res.text();

    const urls = new Set();
    const regex = /"(https:\/\/lh3\.googleusercontent\.com\/pw\/[a-zA-Z0-9\-_]+)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      if (match[1]) urls.add(match[1]);
    }

    if (urls.size === 0) {
      const altRegex = /"(https:\/\/lh3\.googleusercontent\.com\/[a-zA-Z0-9\-_=]+)"/g;
      while ((match = altRegex.exec(html)) !== null) {
        if (match[1] && match[1].length > 80 && !match[1].includes('googleusercontent.com/a/')) {
          urls.add(match[1]);
        }
      }
    }

    return Array.from(urls).map((url, idx) => ({
      id: `shared-album-${idx}`,
      title: 'Optimist Event Photo',
      caption: '',
      uploader: 'Optimist Club',
      date: new Date().toISOString().split('T')[0],
      image: `${url}=w800-h800-no`
    }));
  } catch (err) {
    console.warn('Error fetching shared album photos:', err);
    return [];
  }
}

export default async function handler(req, res) {
  const method = req.method;
  const action = req.query?.action || req.body?.action;

  // HANDLE DELETE (DELETE or POST with action === 'delete')
  if (method === 'DELETE' || action === 'delete') {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ success: false, message: 'You must be signed in to delete a photo.' });
    }

    const { id } = req.body || req.query || {};
    if (!id) return res.status(400).json({ success: false, message: 'Photo ID is required.' });

    try {
      const rows = await sql`
        SELECT id, uploader_id, google_media_item_id FROM gallery WHERE id = ${id};
      `;

      if (rows.length > 0) {
        const photo = rows[0];
        const isAdminOrFinance = CAN_MODERATE_GALLERY.includes(session.access);
        const isUploader = photo.uploader_id && photo.uploader_id === session.memberId;

        if (!isAdminOrFinance && !isUploader) {
          return res.status(403).json({
            success: false,
            message: 'Permission denied. Only admins, super admins, finance roles, and the original uploader can delete this photo.'
          });
        }

        // Google Photos has no API to delete the underlying media item, so
        // record its ID and filter it out of future listings (see GET below).
        if (photo.google_media_item_id) {
          await sql`
            INSERT INTO deleted_media_ids (google_media_item_id)
            VALUES (${photo.google_media_item_id})
            ON CONFLICT (google_media_item_id) DO NOTHING;
          `;
        }
      }

      await sql`DELETE FROM gallery WHERE id = ${id};`;
      return res.status(200).json({ success: true, message: 'Photo deleted successfully.' });
    } catch (err) {
      console.error('gallery delete error:', err);
      return res.status(500).json({ success: false, message: 'Failed to delete photo from gallery.' });
    }
  }

  // HANDLE POST (UPLOAD)
  if (method === 'POST') {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ success: false, message: 'You must be signed in to upload a photo.' });
    }

    const missingEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']
      .filter(k => !process.env[k] || process.env[k].startsWith('REPLACE_ME'));
    if (missingEnv.length > 0) {
      return res.status(500).json({ success: false, message: 'Google Photos is not configured yet.' });
    }

    const { title, caption, imageBase64 } = req.body || {};
    if (!title || !imageBase64) {
      return res.status(400).json({ success: false, message: 'Title and image are required.' });
    }

    const uploaderId = session.memberId;
    const memberRows = await sql`SELECT name FROM members WHERE id = ${uploaderId} LIMIT 1;`;
    const uploaderName = memberRows[0]?.name;
    if (!uploaderName) {
      return res.status(403).json({ success: false, message: 'Your member record could not be found.' });
    }

    const match = /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/.exec(imageBase64);
    if (!match) {
      return res.status(400).json({ success: false, message: 'Image must be a JPEG, PNG, WEBP, or GIF file.' });
    }

    try {
      const accessToken = await getAccessToken();
      const mimeType = match[1];
      const bytes = Buffer.from(match[2], 'base64');

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
      if (!uploadRes.ok) throw new Error(`Google Photos upload failed: ${uploadToken}`);

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

  // HANDLE GET (LIST)
  if (method === 'GET') {
    let dbRows = [];
    try {
      dbRows = await sql`
        SELECT id, title, caption, uploader, google_media_item_id, posted_at
        FROM gallery
        ORDER BY posted_at DESC, created_at DESC;
      `;
    } catch (dbErr) {
      console.warn('gallery-list DB warning:', dbErr);
    }

    const missingEnv = ['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN']
      .filter(k => !process.env[k] || process.env[k].startsWith('REPLACE_ME'));

    if (missingEnv.length > 0) {
      return res.status(200).json({ success: true, photos: [] });
    }

    let deletedIds = new Set();
    try {
      const deletedRows = await sql`SELECT google_media_item_id FROM deleted_media_ids;`;
      deletedIds = new Set(deletedRows.map(r => r.google_media_item_id));
    } catch (dbErr) {
      console.warn('deleted_media_ids DB warning:', dbErr);
    }

    try {
      const accessToken = await getAccessToken();
      const dbMetaById = {};
      for (const r of dbRows) {
        if (r.google_media_item_id) {
          dbMetaById[r.google_media_item_id] = r;
        }
      }

      const photosMap = new Map();
      try {
        const listRes = await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const listData = await listRes.json();
        if (listRes.ok && Array.isArray(listData.mediaItems)) {
          for (const item of listData.mediaItems) {
            if (deletedIds.has(item.id)) continue;
            const dbMatch = dbMetaById[item.id];
            photosMap.set(item.id, {
              id: dbMatch?.id || `g-${item.id}`,
              google_media_item_id: item.id,
              title: dbMatch?.title || item.description || item.filename || 'Optimist Photo',
              caption: dbMatch?.caption || '',
              uploader: dbMatch?.uploader || 'Optimist Club',
              date: dbMatch?.posted_at || new Date().toISOString().split('T')[0],
              image: `${item.baseUrl}=w800-h800-c`,
              source: 'website'
            });
          }
        }
      } catch (listErr) {
        console.warn('Error fetching Google Photos library list:', listErr);
      }

      const missingDbRows = dbRows.filter(r => r.google_media_item_id && !photosMap.has(r.google_media_item_id));

      if (missingDbRows.length > 0) {
        for (const batch of chunk(missingDbRows, 50)) {
          const params = new URLSearchParams();
          batch.forEach(r => params.append('mediaItemIds', r.google_media_item_id));
          const batchRes = await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems:batchGet?${params.toString()}`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          const batchData = await batchRes.json();
          if (batchRes.ok && Array.isArray(batchData.mediaItemResults)) {
            for (const resItem of batchData.mediaItemResults) {
              if (resItem.mediaItem && resItem.mediaItem.baseUrl) {
                const item = resItem.mediaItem;
                const dbMatch = dbMetaById[item.id];
                photosMap.set(item.id, {
                  id: dbMatch?.id || `g-${item.id}`,
                  google_media_item_id: item.id,
                  title: dbMatch?.title || item.description || item.filename || 'Optimist Photo',
                  caption: dbMatch?.caption || '',
                  uploader: dbMatch?.uploader || 'Optimist Club',
                  date: dbMatch?.posted_at || new Date().toISOString().split('T')[0],
                  image: `${item.baseUrl}=w800-h800-c`,
                  source: 'website'
                });
              }
            }
          }
        }
      }

      const albumPhotosList = [];
      const albumUrl = req.query.albumUrl || process.env.GOOGLE_PHOTOS_ALBUM_URL;
      if (albumUrl) {
        const rawAlbumPhotos = await fetchSharedAlbumPhotos(albumUrl);
        for (const p of rawAlbumPhotos) {
          albumPhotosList.push({
            ...p,
            source: 'google_album'
          });
        }
      }

      const websitePhotos = Array.from(photosMap.values()).sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const albumPhotos = albumPhotosList.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      const allPhotos = [...websitePhotos, ...albumPhotos];

      return res.status(200).json({
        success: true,
        photos: allPhotos,
        websitePhotos,
        albumPhotos
      });
    } catch (err) {
      console.error('gallery-list error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch gallery photos.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed.' });
}
