# Sanity Content Architecture

## Overview

The multi-tenant construction starter now fully supports content management through Sanity. All pages and their sections are editable through the Sanity CMS without modifying code.

## Schema Structure

### Core Document Types

#### Page Schema
Manages all pages across the site with flexible section-based layout.

**Fields:**
- `title` (string): Page title
- `slug` (slug): URL slug (e.g., `home`, `company`, `services`, `contact`)
- `description` (text): Short page description
- `image` (image): Fallback hero image
- `pageType` (string): `"home"` or `"standard"`
- `sections` (array): Ordered list of section objects (see below)
- `clientId` (string): Multi-tenant reference

**Example:** A home page with slug `"home"` will display at `/` while `"company"` displays at `/company`.

#### Service Schema
Individual service offerings, now with rich content support.

**Fields:**
- `title` (string): Service name
- `slug` (slug): URL slug for `/services/[slug]`
- `description` (text): Short description
- `richDescription` (array): Portable Text blocks for rich formatting
- `image` (image): Service hero image
- `imageUrl` (url): External image fallback
- `measures` (array): List of steps/measures
- `icon` (string): Icon identifier
- `clientId` (string): Multi-tenant reference

### Section Types (Reusable Components)

All sections are object types that can be added to any Page's sections array.

#### 1. **Image Slider Section** (`imageSliderSection`)
Full-width image carousel at the top of pages.

```typescript
{
  _type: "imageSliderSection",
  slides: [
    { image: {...}, caption: "..." },
    // ...
  ],
  autoplay: true,
  autoplayInterval: 5000
}
```

#### 2. **Hero Section** (`heroSection`)
Large title with subtitle, description, and optional CTA button.

```typescript
{
  _type: "heroSection",
  title: "About Us",
  subtitle: "Building Excellence",
  description: "...",
  image: {...},
  linkText: "Learn More",
  linkHref: "/services"
}
```

#### 3. **Before/After Section** (`beforeAfterSection`)
Side-by-side comparison sliders in a grid.

```typescript
{
  _type: "beforeAfterSection",
  title: "Our Work",
  description: "...",
  pairs: [
    {
      before: {...},
      after: {...},
      title: "Project Name",
      subtitle: "..."
    }
  ],
  columns: 2,
  gap: "1rem"
}
```

#### 4. **Company Section** (`companySection`)
Company info with subsections (team, values, etc.).

```typescript
{
  _type: "companySection",
  title: "Über uns",
  subtitle: "...",
  description: "...",
  image: {...},
  subsections: [
    {
      title: "Our Mission",
      description: "...",
      icon: "target"
    }
  ]
}
```

#### 5. **Services Section** (`servicesSection`)
Display and link to multiple services.

```typescript
{
  _type: "servicesSection",
  title: "Our Services",
  description: "...",
  services: [
    { _ref: "service-id-1", _type: "reference" },
    { _ref: "service-id-2", _type: "reference" }
  ]
}
```

#### 6. **Projects Section** (`projectsSection`)
Gallery of featured projects with optional "View All" button.

```typescript
{
  _type: "projectsSection",
  title: "Recent Work",
  description: "...",
  projects: [
    // reference objects
  ],
  showViewAllButton: true,
  viewAllButtonText: "Alle Referenzen anzeigen",
  viewAllButtonLink: "/projects"
}
```

#### 7. **CTA Section** (`ctaSection`)
Call-to-action banner with primary and secondary buttons.

```typescript
{
  _type: "ctaSection",
  title: "Ready to Start?",
  description: "Get in touch with us today.",
  primaryButton: { text: "Contact Us", href: "/contact" },
  secondaryButton: { text: "Learn More", href: "/services" },
  backgroundColor: "bg-primary",
  textColor: "text-primary-foreground"
}
```

## Usage

### Creating Pages

1. **In Sanity Studio**, create a new "Page" document
2. **Set required fields:**
   - Title: "Company"
   - Slug: "company"
   - Page Type: "standard" or "home"
   - Client ID: matching client's ID
3. **Add sections** by clicking "Add section" in the sections array
4. **Choose section type** and configure fields
5. **Publish**

### Creating Home Page

1. Create a Page with slug `"home"` and type `"home"`
2. Add sections in desired order:
   - Image Slider Section (optional, appears first)
   - Hero Sections (optional, multiple allowed)
   - Before/After Section (optional)
   - Company Section (optional)
   - Services Section (optional)
   - Projects Section (optional)
   - CTA Section (optional)
3. Publish - home page at `/` will render all sections in order

### Creating Service Pages

1. Create a "Service" document with:
   - Title: "Renovations"
   - Slug: "renovations"
   - Rich Description: Portable Text content
   - Measures: Array of steps
   - Client ID: matching client
2. Service will appear at `/services/renovations`
3. Reference services in any Services Section for display on pages

### Creating Dynamic Content Pages

Instead of separate `/company`, `/contact`, `/exklusiv`, `/fachmarkt` route files:

1. Create Page documents for each with appropriate slug
2. Add sections to each page for unique layouts
3. All render through the dynamic `[slug]` route

## Frontend Implementation

### HomePage (`app/(site)/page.tsx`)
- Attempts to fetch Page with slug `"home"` from Sanity
- Falls back to legacy JSON approach if not found
- Renders sections using `SectionRenderer` component

### Generic Pages (`app/(site)/[slug]/page.tsx`)
- Fetches Page by slug from Sanity
- If page has sections, renders via `SectionRenderer`
- Otherwise, falls back to simple description display
- Works for routes like `/company`, `/contact`, `/fachmarkt`, etc.

### Service Detail (`app/(site)/services/[slug]/page.tsx`)
- Fetches Service by slug from Sanity
- Displays rich description using PortableText
- Shows measures list
- Works for `/services/[slug]` routes

### SectionRenderer Component (`components/SectionRenderer.tsx`)
Central component that:
- Maps section `_type` to appropriate component
- Passes section data to each component
- Handles references (e.g., service references)
- Manages responsive layouts and styling

## Multi-Tenant Configuration

Each client should have its own set of Pages and Services with matching `clientId`:

```
Alpha Client
├── Page (home)
├── Page (company)
├── Page (contact)
├── Service (Renovations)
└── Service (Extensions)

Beta Client
├── Page (home)
├── Page (company)
├── Service (Repairs)
└── Service (Consultations)
```

## Fallback Behavior

- **Sanity unavailable**: Falls back to JSON static data
- **No home page found**: Uses legacy MainSection approach
- **No page/service found**: Returns 404

## Migration from Static Routes

Old static routes:
```
app/(site)/company/page.tsx
app/(site)/contact/page.tsx
app/(site)/exklusiv/page.tsx
app/(site)/fachmarkt/page.tsx
app/(site)/projects/page.tsx
app/(site)/services/page.tsx
```

Can now be deleted and replaced with Page documents in Sanity.

## Best Practices

1. **Slug consistency**: Use lowercase, hyphens instead of spaces
2. **Section ordering**: Arrange sections logically (slider first, CTA last)
3. **Image optimization**: Sanity auto-optimizes; external URLs work too
4. **References**: Use service/project references for maintainability
5. **Client IDs**: Always set clientId for multi-tenant isolation

## Expanding Sections

To add a new section type:

1. Create schema file: `sanity/schemaTypes/sections/newSection.ts`
2. Define object type with fields
3. Add to index.ts schema array
4. Add to Page schema's `of:` array
5. Create renderer in `SectionRenderer.tsx` switch statement
6. Add component import if needed
