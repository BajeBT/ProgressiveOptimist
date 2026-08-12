import { sql } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  const { id, userMemberId, userName, userRole, userAccess } = req.body || req.query || {};

  if (!id) {
    return res.status(400).json({ success: false, message: 'Photo ID is required.' });
  }

  try {
    // Fetch photo metadata from Neon DB to verify ownership
    const rows = await sql`
      SELECT id, uploader, uploader_id FROM gallery WHERE id = ${id};
    `;

    if (rows.length > 0) {
      const photo = rows[0];

      // Check authorization: Must be super admin, admin, finance, executive/officer OR the original uploader
      const roleStr = String(userRole || '').toLowerCase();
      const accessStr = String(userAccess || '').toLowerCase();
      const isAdminOrFinance = ['super admin', 'admin', 'finance', 'executive', 'officer', 'president', 'treasurer'].includes(roleStr) ||
                               ['super admin', 'admin', 'finance'].includes(accessStr);

      const isUploader = (photo.uploader_id && userMemberId && photo.uploader_id === userMemberId) ||
                         (photo.uploader && userName && photo.uploader.toLowerCase() === String(userName).toLowerCase());

      if (!isAdminOrFinance && !isUploader) {
        return res.status(403).json({ 
          success: false, 
          message: 'Permission denied. Only admins, super admins, finance roles, and the original uploader can delete this photo.' 
        });
      }
    }

    await sql`
      DELETE FROM gallery WHERE id = ${id};
    `;

    return res.status(200).json({ success: true, message: 'Photo deleted successfully.' });
  } catch (err) {
    console.error('gallery-delete error:', err);
    return res.status(500).json({ success: false, message: 'Failed to delete photo from gallery.' });
  }
}
