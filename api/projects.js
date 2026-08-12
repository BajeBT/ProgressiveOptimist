import { sql, requireDatabase } from '../lib/db.js';
import { getSession, requireAccess } from '../lib/session.js';

const CAN_MODERATE = ['super admin', 'finance', 'admin', 'moderator'];

async function handleList(req, res) {
  const rows = await sql`SELECT * FROM projects ORDER BY posted_at DESC;`;
  return res.status(200).json({ success: true, projects: rows });
}

async function handleCreate(req, res, session) {
  const p = req.body?.project || {};

  if (!p.title || !p.excerpt || !p.content) {
    return res.status(400).json({ success: false, message: 'Title, excerpt, and content are required.' });
  }

  const childrenServed = Number(p.childrenServed);
  if (!Number.isInteger(childrenServed) || childrenServed < 0) {
    return res.status(400).json({
      success: false,
      message: 'Number of Children Impacted is required and must be a whole number of 0 or more.'
    });
  }

  // Posts by a moderator go live immediately; everyone else's wait for review.
  const approved = CAN_MODERATE.includes(session.access);
  const id = 'proj-' + Date.now();
  const postedAt = new Date().toISOString().split('T')[0];

  const rows = await sql`
    INSERT INTO projects (
      id, title, category, date_str, image, flyer_url, excerpt, content, impact,
      is_featured, author, author_id, posted_at, children_served, approved
    )
    VALUES (
      ${id}, ${p.title}, ${p.category || 'Volunteer Project'}, ${p.date || postedAt},
      ${p.image || null}, ${p.flyerUrl || null}, ${p.excerpt}, ${p.content},
      ${p.impact || 'Community Initiative'}, ${Boolean(p.isFeatured)},
      ${p.author || ''}, ${session.memberId}, ${postedAt}, ${childrenServed}, ${approved}
    )
    RETURNING *;
  `;

  return res.status(200).json({ success: true, project: rows[0], approved });
}

async function handleModerate(req, res, action) {
  const projectId = req.body?.projectId;
  if (!projectId) {
    return res.status(400).json({ success: false, message: 'A project id is required.' });
  }

  if (action === 'approve') {
    await sql`UPDATE projects SET approved = TRUE WHERE id = ${projectId};`;
  } else {
    await sql`DELETE FROM projects WHERE id = ${projectId};`;
  }
  return res.status(200).json({ success: true });
}

export default async function handler(req, res) {
  if (!requireDatabase(res)) return;

  try {
    if (req.method === 'GET') {
      return await handleList(req, res);
    }

    if (req.method !== 'POST') {
      return res.status(405).json({ success: false, message: 'Method not allowed.' });
    }

    const action = req.body?.action;

    if (action === 'create') {
      const session = getSession(req);
      if (!session) {
        return res.status(401).json({ success: false, message: 'You must be signed in as a member to post a project.' });
      }
      return await handleCreate(req, res, session);
    }

    if (action === 'approve' || action === 'delete') {
      const session = requireAccess(req, res, CAN_MODERATE);
      if (!session) return;
      return await handleModerate(req, res, action);
    }

    return res.status(400).json({ success: false, message: 'Unknown action.' });
  } catch (err) {
    console.error(`projects (${req.method} ${req.body?.action || 'list'}) error:`, err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
