import crypto from 'crypto';

// Minimal signed session tokens. The app previously kept the logged-in user in
// localStorage only, which the browser owner can edit freely - so any check on
// it was advisory. These tokens are signed server-side, letting the routes
// verify who is calling rather than trusting whatever the client claims.

const SESSION_TTL_HOURS = 12;

function secret() {
  return process.env.SESSION_SECRET || '';
}

export function isSessionConfigured() {
  return secret().length > 0;
}

function base64url(buf) {
  return Buffer.from(buf).toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function sign(data) {
  return base64url(crypto.createHmac('sha256', secret()).update(data).digest());
}

export function createSession({ memberId, email, access }) {
  const payload = base64url(JSON.stringify({
    memberId,
    email,
    access,
    exp: Date.now() + SESSION_TTL_HOURS * 60 * 60 * 1000
  }));
  return `${payload}.${sign(payload)}`;
}

export function verifySession(token) {
  if (!token || !isSessionConfigured()) return null;

  const [payload, signature] = String(token).split('.');
  if (!payload || !signature) return null;

  const expected = sign(payload);
  // Constant-time compare so a forged token cannot be refined byte by byte.
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

// Reads and verifies the caller's session from the Authorization header.
export function getSession(req) {
  const header = req.headers?.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  return verifySession(token);
}

// Guard for routes that mutate data. Returns the session, or null after having
// already written the error response.
export function requireAccess(req, res, allowedTiers) {
  const session = getSession(req);
  if (!session) {
    res.status(401).json({ success: false, message: 'You must be signed in to do that.' });
    return null;
  }
  if (allowedTiers && !allowedTiers.includes(session.access)) {
    res.status(403).json({ success: false, message: 'Your account does not have permission to do that.' });
    return null;
  }
  return session;
}
