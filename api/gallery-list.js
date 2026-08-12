import { sql } from '../lib/db.js';

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
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

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
    // Not configured yet - fail soft so the rest of the portal keeps working.
    return res.status(200).json({ success: true, photos: [] });
  }

  try {
    const accessToken = await getAccessToken();

    // Map DB metadata by google_media_item_id
    const dbMetaById = {};
    for (const r of dbRows) {
      if (r.google_media_item_id) {
        dbMetaById[r.google_media_item_id] = r;
      }
    }

    const photosMap = new Map();

    // 1. Fetch direct media items from Google Photos Library API (paging through all pages)
    try {
      let pageToken = null;
      let pageCount = 0;
      const MAX_PAGES = 10; // Up to 1000 photos

      do {
        let apiUrl = 'https://photoslibrary.googleapis.com/v1/mediaItems?pageSize=100';
        if (pageToken) {
          apiUrl += `&pageToken=${encodeURIComponent(pageToken)}`;
        }

        const listRes = await fetch(apiUrl, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        const listData = await listRes.json();

        if (listRes.ok && Array.isArray(listData.mediaItems)) {
          for (const item of listData.mediaItems) {
            if (!item.id || !item.baseUrl) continue;
            
            const dbMatch = dbMetaById[item.id];
            const postedDate = dbMatch?.posted_at 
              || (item.mediaMetadata?.creationTime ? item.mediaMetadata.creationTime.split('T')[0] : new Date().toISOString().split('T')[0]);
            
            photosMap.set(item.id, {
              id: dbMatch?.id || `g-${item.id}`,
              google_media_item_id: item.id,
              title: dbMatch?.title || item.description || item.filename || 'Optimist Photo',
              caption: dbMatch?.caption || (item.description && item.description !== dbMatch?.title ? item.description : ''),
              uploader: dbMatch?.uploader || 'Optimist Club',
              date: postedDate,
              image: `${item.baseUrl}=w800-h800-c`,
              source: 'website'
            });
          }
          pageToken = listData.nextPageToken || null;
        } else {
          console.warn('Google Photos mediaItems:list response:', listData);
          break;
        }
        pageCount++;
      } while (pageToken && pageCount < MAX_PAGES);
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
    return res.status(500).json({ success: false, message: 'Failed to load photo gallery.' });
  }
}
