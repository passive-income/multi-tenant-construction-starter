# Dashboard Quick Start

## Installation

```bash
# Already done: @clerk/nextjs is installed
pnpm install @clerk/nextjs
```

## Environment Configuration

Add to `.env.local`:

```bash
# Clerk (already configured from previous setup)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here

# Dashboard Security
DASHBOARD_API_SECRET=$(openssl rand -hex 32)
SANITY_WEBHOOK_ENABLED=false
```

Generate a secure secret:
```bash
openssl rand -hex 32
```

Then update `.env.local`:
```bash
DASHBOARD_API_SECRET=your-generated-secret-here
```

## Clerk User Setup

To grant a user access to a dashboard tenant:

### Option 1: Via Clerk Dashboard UI
1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Go to Users
4. Select a user
5. Under "Public metadata", add:
```json
{
  "clientId": "mueller"
}
```

### Option 2: Via Clerk API
```bash
curl -X PATCH https://api.clerk.com/v1/users/{user_id} \
  -H "Authorization: Bearer $CLERK_SECRET_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "public_metadata": {
      "clientId": "mueller"
    }
  }'
```

Replace `{user_id}` with the actual user ID and `"mueller"` with the correct tenant `clientId`.

## Testing the Dashboard

1. **Start dev server:**
   ```bash
   pnpm dev
   ```

2. **Access dashboard:**
   ```
   http://localhost:3000/dashboard
   ```

3. **Sign in:**
   - Click sign-in button
   - Use Clerk sign-in flow
   - First-time users will be prompted to create an account

4. **View tenant data:**
   - Dashboard shows overview with content counts
   - All data automatically scoped to user's `clientId`

5. **Test content creation:**
   ```bash
   # Go to Pages → New Page
   # Fill in title, slug
   # Click Save
   # Page appears in list with your clientId
   ```

6. **Test GDPR compliance:**
   - Go to Dashboard → Data & Privacy
   - Click "Export My Data" → JSON downloads
   - Data includes all your content with timestamps
   - Click "Delete My Account" → audit logged

## Routes & Features

| Route | Feature | Auth |
|-------|---------|------|
| `/dashboard` | Overview & stats | Required |
| `/dashboard/pages` | Page CRUD | Required |
| `/dashboard/services` | Service management | Coming soon |
| `/dashboard/projects` | Project management | Coming soon |
| `/dashboard/team` | Team management | Coming soon |
| `/dashboard/settings` | Tenant config & cache clear | Required |
| `/dashboard/data` | GDPR export & deletion | Required |
| `/api/dashboard/pages` | Pages REST API | Required |
| `/api/dashboard/gdpr` | Data export & deletion API | Required |

## Security Checks

✅ **Authentication**
- Clerk middleware protects `/dashboard` routes
- Sign-in required
- Session managed by Clerk

✅ **Authorization**
- Users can only access their own tenant's data
- API validates `clientId` from Clerk metadata
- Cross-tenant requests return 403 Forbidden

✅ **Data Isolation**
- All queries filtered by user's `clientId`
- No API to list other tenants' content
- Audit logs track all deletions

✅ **GDPR Compliance**
- Export data in standard format (JSON)
- Delete account with audit log
- Retention policy documented

## Troubleshooting

### "User does not have a tenant assigned"
**Problem:** User trying to access dashboard but no `clientId` in Clerk metadata
**Solution:** Add `clientId` to user's public metadata in Clerk Dashboard

### "Access denied: you do not have permission"
**Problem:** User trying to access another tenant's content
**Solution:** Verify `clientId` matches in API call

### Cache not clearing
**Problem:** "Clear Cache Now" button shows error
**Solution:** Verify `DASHBOARD_API_SECRET` is set correctly in `.env.local`

### Clerk sign-in not working
**Problem:** Clerk UI not rendering
**Solution:** 
1. Verify `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is correct
2. Clear browser cache
3. Check Clerk Dashboard is configured

## Next Steps

1. **Assign users:** Add `clientId` to team members in Clerk
2. **Test workflow:** Create a page, publish, see it on site
3. **Configure cache:** Set `DASHBOARD_API_SECRET` for instant revalidation
4. **Review GDPR:** Check audit logs and retention policy

## Architecture Diagram

```
Browser
  ↓
Clerk SignIn
  ↓
/dashboard (Middleware protects route)
  ↓
Verify clientId in Clerk metadata
  ↓
API Routes (/api/dashboard/*)
  ↓
Sanity Query (filtered by clientId)
  ↓
Display tenant-specific content
```

## API Documentation

See [DASHBOARD_INTEGRATION.md](./DASHBOARD_INTEGRATION.md) for full API details.
See [DASHBOARD_SETUP.md](./DASHBOARD_SETUP.md) for comprehensive setup guide.
