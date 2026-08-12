import crypto from 'crypto';

// Excludes visually ambiguous characters (0/O, 1/l/I) since these passwords
// get read aloud or copied by hand when a super admin hands them to an officer.
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';

export function generateRandomPassword(length = 16) {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += CHARSET[bytes[i] % CHARSET.length];
  }
  return out;
}
