import { sql, ensureSystemAlerts, ensureSharedAlbums } from '../lib/db.js';
import { getSession, requireAccess } from '../lib/session.js';
import { sendEmail } from '../lib/email.js';

const CAN_MODERATE_GALLERY = ['super admin', 'admin', 'finance'];

// The Google Photos credential is a refresh token that Google revokes on its
// own schedule, and nothing in the app can renew it - a person has to
// re-authorise. These are the addresses told when that happens.
const TOKEN_ALERT_RECIPIENTS = [
  'admin@progressiveoptimist.org',
  'pro@progressiveoptimist.org',
  'dev@bajanthings.biz'
];

const GOOGLE_PHOTOS_ACCOUNT = 'ProgressiveOC@gmail.com';

// Claimed through the database rather than in memory: every request runs in its
// own serverless instance, so an in-process flag would not stop the officers
// being emailed on every page load. The UPDATE only matches when the last
// alert is over a day old, so exactly one caller wins the claim.
async function claimTokenAlert() {
  try {
    await ensureSystemAlerts();
    const rows = await sql`
      INSERT INTO system_alerts (key, last_sent_at)
      VALUES ('google_photos_token', CURRENT_TIMESTAMP)
      ON CONFLICT (key) DO UPDATE SET last_sent_at = CURRENT_TIMESTAMP
      WHERE system_alerts.last_sent_at < CURRENT_TIMESTAMP - INTERVAL '24 hours'
      RETURNING key;
    `;
    return rows.length > 0;
  } catch (err) {
    // Better to stay quiet than to mail on every request because the throttle
    // itself is broken.
    console.warn('system_alerts claim warning:', err);
    return false;
  }
}

async function notifyGoogleTokenExpired(reason) {
  if (!(await claimTokenAlert())) return;

  const subject = 'Action needed: Google Photos connection for the club website needs re-authorising';
  const body = [
    "The website's Google Photos connection has stopped working, so no photos are loading in the",
    'Shared Members Photos tab of the member portal. Members currently see a notice saying photos',
    'are temporarily unavailable.',
    '',
    `Reported by Google: ${reason}`,
    '',
    'This usually happens when the credential goes unused for six months, the Google account',
    'password is changed, or access is revoked in that account\'s security settings. No photos have',
    'been lost - they are still in Google Photos, the website just cannot read them at the moment.',
    '',
    `To fix it, someone with access to ${GOOGLE_PHOTOS_ACCOUNT} needs to:`,
    '',
    `  1. Sign in to the ${GOOGLE_PHOTOS_ACCOUNT} Google account.`,
    '  2. Open the Google Cloud console for the project that owns the website OAuth client and',
    '     confirm the Photos Library API is still enabled.',
    '  3. Re-run the OAuth consent flow for that client to issue a new refresh token, granting the',
    '     Photos Library scope.',
    '  4. Update GOOGLE_REFRESH_TOKEN in the Vercel project environment variables with the new',
    '     value, then redeploy the site.',
    '',
    'The rest of the member portal is unaffected - only the photo gallery.',
    '',
    'This is an automated message from the club website. It is sent at most once every 24 hours',
    'while the connection stays broken, and stops on its own once the token is renewed.'
  ].join('\n');

  for (const to of TOKEN_ALERT_RECIPIENTS) {
    try {
      await sendEmail({ to, subject, body });
    } catch (err) {
      console.error('Google token alert email failed for', to, err);
    }
  }
}

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


// ---------------------------------------------------------------------------
// Shared albums
//
// These live here rather than in their own api/shared-albums.js because Vercel
// turns every file under /api into a Serverless Function, and the Hobby plan
// allows twelve per deployment - a thirteenth file fails the deploy outright.
// Albums are gallery configuration, so this is their natural home anyway.
// ---------------------------------------------------------------------------
const CAN_EDIT_ALBUMS = ['super admin', 'finance', 'admin'];

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

function toAlbumShape(row) {
  return {
    id: String(row.id),
    title: row.title,
    url: row.url
  };
}

async function handleAlbumList(req, res) {
  await seedIfEmpty();
  const rows = await sql`SELECT * FROM shared_albums ORDER BY sort_order ASC, created_at ASC;`;
  return res.status(200).json({ success: true, albums: rows.map(toAlbumShape) });
}

async function handleAlbumAdd(req, res, session) {
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
  return res.status(200).json({ success: true, album: toAlbumShape(rows[0]), message: `"${title}" added to the gallery.` });
}

async function handleAlbumUpdate(req, res) {
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
  return res.status(200).json({ success: true, album: toAlbumShape(rows[0]) });
}

async function handleAlbumDelete(req, res) {
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
  const method = req.method;

  // Album list: a query flag rather than a separate route, for the reason in
  // the Shared albums banner above.
  if (method === 'GET' && req.query?.resource === 'albums') {
    await ensureSharedAlbums();
    try {
      return await handleAlbumList(req, res);
    } catch (err) {
      console.error('shared-albums (list) error:', err);
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }

  // Album writes are distinguished from a photo upload by carrying an action;
  // an upload POST has no action field and still falls through below.
  if (method === 'POST' && typeof req.body?.action === 'string') {
    await ensureSharedAlbums();
    const session = requireAccess(req, res, CAN_EDIT_ALBUMS);
    if (!session) return;

    try {
      switch (req.body.action) {
        case 'add-album':
          return await handleAlbumAdd(req, res, session);
        case 'update-album':
          return await handleAlbumUpdate(req, res);
        case 'delete-album':
          return await handleAlbumDelete(req, res);
        default:
          return res.status(400).json({ success: false, message: 'Unknown action.' });
      }
    } catch (err) {
      console.error(`shared-albums (${req.body.action}) error:`, err);
      return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
    }
  }

  const action = req.query?.action || req.body?.action;

  // HANDLE DELETE (DELETE or POST with action === 'delete')
  if (method === 'DELETE' || action === 'delete') {
    const session = getSession(req);
    if (!session) {
      return res.status(401).json({ success: false, message: 'You must be signed in to delete a photo.' });
    }

    const { id, google_media_item_id: clientMediaItemId } = req.body || req.query || {};
    if (!id) return res.status(400).json({ success: false, message: 'Photo ID is required.' });

    try {
      const rows = await sql`
        SELECT id, uploader_id, google_media_item_id FROM gallery WHERE id = ${id};
      `;

      let mediaItemId = null;

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

        mediaItemId = photo.google_media_item_id;
      } else if (clientMediaItemId) {
        // No gallery row exists for this photo (e.g. it was added to Google
        // Photos outside the website), so there's no recorded uploader to
        // check against - only admins/finance can remove it from the listing.
        const isAdminOrFinance = CAN_MODERATE_GALLERY.includes(session.access);
        if (!isAdminOrFinance) {
          return res.status(403).json({
            success: false,
            message: 'Permission denied. Only admins, super admins, and finance roles can delete this photo.'
          });
        }
        mediaItemId = clientMediaItemId;
      }

      // Google Photos has no API to delete the underlying media item, so
      // record its ID and filter it out of future listings (see GET below).
      if (mediaItemId) {
        await sql`
          INSERT INTO deleted_media_ids (google_media_item_id)
          VALUES (${mediaItemId})
          ON CONFLICT (google_media_item_id) DO NOTHING;
        `;
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

    let deletedIds = new Set();
    try {
      const deletedRows = await sql`SELECT google_media_item_id FROM deleted_media_ids;`;
      deletedIds = new Set(deletedRows.map(r => r.google_media_item_id));
    } catch (dbErr) {
      console.warn('deleted_media_ids DB warning:', dbErr);
    }

    // A revoked or missing Google token must not take down the photos that do
    // not depend on it - a shared album is public HTML, so it still loads.
    let accessToken = null;
    let googleUnavailable = null;

    if (missingEnv.length > 0) {
      googleUnavailable = 'Google Photos is not configured.';
    } else {
      try {
        accessToken = await getAccessToken();
      } catch (tokenErr) {
        console.error('gallery-list token error:', tokenErr);
        googleUnavailable = 'The club Google Photos connection needs to be re-authorised.';
        // Never let a failed alert break the gallery response.
        try {
          await notifyGoogleTokenExpired(tokenErr.message || 'Unknown error');
        } catch (alertErr) {
          console.error('Google token alert failed:', alertErr);
        }
      }
    }

    try {
      const dbMetaById = {};
      for (const r of dbRows) {
        if (r.google_media_item_id) {
          dbMetaById[r.google_media_item_id] = r;
        }
      }

      const photosMap = new Map();
      try {
        const listRes = accessToken && await fetch('https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100', {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const listData = listRes ? await listRes.json() : {};
        if (listRes && listRes.ok && Array.isArray(listData.mediaItems)) {
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

      const missingDbRows = accessToken
        ? dbRows.filter(r => r.google_media_item_id && !photosMap.has(r.google_media_item_id))
        : [];

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
        albumPhotos,
        ...(googleUnavailable ? { googleUnavailable: true, googleMessage: googleUnavailable } : {})
      });
    } catch (err) {
      console.error('gallery-list error:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch gallery photos.' });
    }
  }

  return res.status(405).json({ success: false, message: 'Method not allowed.' });
}
