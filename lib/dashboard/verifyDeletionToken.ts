export async function verifyDeletionToken(deletionToken?: string | null) {
  // Minimal server-side verification: require a server-issued token
  // Set ACCOUNT_DELETION_TOKEN in your environment for deletion requests
  if (!deletionToken) return false;
  const expected = process.env.ACCOUNT_DELETION_TOKEN;
  if (!expected) return false;
  try {
    return deletionToken === expected;
  } catch (_err) {
    return false;
  }
}

export default verifyDeletionToken;
