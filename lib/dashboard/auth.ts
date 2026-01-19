/**
 * Utility to extract tenant info from Clerk user metadata
 * Clerk user object has publicMetadata and privateMetadata
 * Store clientId in publicMetadata for easy access
 */

import { auth } from '@clerk/nextjs/server';

export async function getCurrentTenant() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Not authenticated');
  }

  // Get user from Clerk
  const response = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user');
  }

  const user = await response.json();
  const clientId = user.public_metadata?.clientId as string | undefined;

  if (!clientId) {
    throw new Error('User does not have a tenant assigned (missing clientId in metadata)');
  }

  return { userId, clientId };
}

export function validateTenantAccess(userClientId: string, resourceClientId: string) {
  if (userClientId !== resourceClientId) {
    throw new Error('Access denied: you do not have permission to access this resource');
  }
}
