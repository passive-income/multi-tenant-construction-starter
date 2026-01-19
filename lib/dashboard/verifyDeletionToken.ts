import crypto from 'node:crypto';

export function verifyDeletionToken(deletionToken?: string | null) {
  // Use fixed-size digests to avoid leaking length info, then compare in constant time
  if (!deletionToken) return false;
  const expected = process.env.ACCOUNT_DELETION_TOKEN;
  if (!expected) return false;
  const a = crypto.createHash('sha256').update(String(deletionToken), 'utf8').digest();
  const b = crypto.createHash('sha256').update(String(expected), 'utf8').digest();
  return crypto.timingSafeEqual(a, b);
}

export default verifyDeletionToken;
