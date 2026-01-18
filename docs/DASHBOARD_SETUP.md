# Dashboard Setup & Usage Guide

## Overview

The dashboard is a multi-tenant content management system built with Next.js, Clerk authentication, and Sanity CMS. It allows tenant admins to manage their website content while ensuring data isolation and GDPR compliance.

## Architecture

```
Dashboard (Next.js)
├── Authentication (Clerk)
├── Pages
│   ├── /dashboard (overview)
│   ├── /dashboard/pages (CRUD)
│   ├── /dashboard/services (CRUD)
│   ├── /dashboard/projects (CRUD)
│   ├── /dashboard/team (user management)
│   ├── /dashboard/settings (tenant config)
│   └── /dashboard/data (GDPR compliance)
├── API Routes
│   ├── /api/dashboard/pages (CRUD operations)
│   ├── /api/dashboard/gdpr (data export/deletion)
│   └── /api/revalidate/tenant (cache invalidation)
└── Sanity Integration
    └── Per-tenant data filtering via clientId
```

## Environment Setup

Add to `.env.local`:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx

# Dashboard API Security
DASHBOARD_API_SECRET=your-secure-random-secret
SANITY_WEBHOOK_ENABLED=false
```

Generate `DASHBOARD_API_SECRET`:
```bash
openssl rand -hex 32
```

## User Assignment (Clerk Metadata)

To grant a user access to a tenant, add their `clientId` to their Clerk public metadata:

### Via Clerk Dashboard
1. Go to Clerk Dashboard → Users
2. Select user
3. Add to "Public metadata":
```json
{
  "clientId": "mueller"
}
```

### Via Clerk API
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

## Key Features

### 1. Data Isolation (Multi-Tenancy)

All pages, services, projects, and content are automatically filtered by the user's `clientId`. Users cannot:
- See other tenants' content
- Modify other tenants' pages
- Access other tenants' settings

**Implementation:**
```typescript
// Every API route validates tenant access
const { clientId } = await getCurrentTenant();
const page = await client.fetch('*[_type == "page" && clientId == $clientId][0]', { clientId });
```

### 2. GDPR Compliance

#### Article 15 - Right of Access
Users can download a complete export of their data:
- Dashboard → Data & Privacy → "Export My Data"
- Returns JSON with all pages, services, projects, team members
- Includes metadata and timestamps

#### Article 17 - Right to be Forgotten
Users can request deletion of their account:
- Dashboard → Data & Privacy → "Delete My Account"
- Requires double confirmation
- Deletes all tenant data
- Audit logged for compliance

#### Data Retention Policy
- Default: 3 years after last activity
- Configurable per tenant
- Audit logs retained separately for 7 years

#### Audit Logging
All deletions and sensitive actions are logged:
```typescript
{
  _type: 'auditLog',
  action: 'ACCOUNT_DELETION',
  clientId,
  userId,
  timestamp,
  ipAddress,
  description
}
```

### 3. Content Management

#### Pages
- Create/edit/delete custom pages
- Each page has slug, title, sections, SEO metadata
- Automatically scoped to user's tenant

#### Services & Projects
- Similar CRUD operations
- Coming soon: Full UI implementation
- Template support planned

### 4. Cache Management

After publishing changes, admins can manually invalidate cache:
- Dashboard → Settings → "Clear Cache Now"
- Or automatically via dashboard API

## API Endpoints

### Pages CRUD
```bash
# List pages
GET /api/dashboard/pages
Authorization: Clerk auth required

# Create page
POST /api/dashboard/pages
Body: { title, slug, clientId, sections, seo }

# Get page
GET /api/dashboard/pages/{id}

# Update page
PATCH /api/dashboard/pages/{id}
Body: { title, slug, sections, seo, ... }

# Delete page
DELETE /api/dashboard/pages/{id}
```

### GDPR Endpoints
```bash
# Export data
GET /api/dashboard/gdpr/export
Returns: JSON with all tenant data

# Delete account
POST /api/dashboard/gdpr
Body: { confirmDeletion: true }
Returns: { success, auditLogId }
```

### Cache Revalidation
```bash
POST /api/revalidate/tenant
Header: x-dashboard-secret: $DASHBOARD_API_SECRET
Body: { clientId: "mueller" }
```

## Security Considerations

### 1. Authentication
- Clerk handles authentication via OAuth
- Only sign-in method enabled (no sign-up for external users)
- Admin can invite users via Clerk Dashboard

### 2. Authorization
- Middleware protects `/dashboard` routes
- API routes validate `clientId` from Clerk metadata
- Cross-tenant access attempt → 403 Forbidden

### 3. Data Protection
- All API calls require Clerk authentication
- `DASHBOARD_API_SECRET` protects revalidation endpoint
- Audit logs for all modifications

## Workflow Example

### Admin adds a service
1. Go to Dashboard → Services
2. Click "New Service"
3. Fill title, slug, description, images
4. Save
5. Service automatically scoped to admin's clientId
6. Cache invalidated automatically
7. Live on site in < 1 second

### User exports their data (GDPR compliance)
1. Go to Dashboard → Data & Privacy
2. Click "Export My Data"
3. JSON file downloads with all content
4. User has a copy of their data

### User deletes their account
1. Go to Dashboard → Data & Privacy
2. Click "Delete My Account"
3. Confirm 2x (confirmation dialog + password prompt)
4. All data deleted immediately
5. Audit log created for compliance

## Troubleshooting

### "User does not have a tenant assigned"
→ Add `clientId` to user's Clerk public metadata

### "Access denied: you do not have permission"
→ User trying to access different tenant's content
→ Verify `clientId` matches in Clerk metadata

### Cache not clearing
→ Ensure `DASHBOARD_API_SECRET` is set correctly
→ Check revalidate endpoint is returning 200

## Future Enhancements

- [ ] Team member management (invite, roles, permissions)
- [ ] Advanced section editor (drag-drop)
- [ ] Image optimization & CDN
- [ ] Scheduling (publish later)
- [ ] Version history & rollback
- [ ] Collaboration features
- [ ] Analytics dashboard
- [ ] GDPR consent management (cookie banner tracking)
- [ ] EU data residency option

## References

- [Clerk Documentation](https://clerk.com/docs)
- [GDPR Articles](https://gdpr-info.eu/)
- [Sanity CMS](https://www.sanity.io/)
- [Next.js App Router](https://nextjs.org/docs)
