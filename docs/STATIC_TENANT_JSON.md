# Static Tenant JSON (pages + sections)

## Goal

Keep one shared codebase, but allow each tenant to have a "static mode" JSON file that behaves like Sanity (ordered page sections). When the tenant later wants to move to Sanity, you can import the same structure with a script.

## Minimal JSON Format (Recommended)

Create a tenant file under `data/`, e.g. `data/static-mueller.json`:

```json
{
  "clientId": "mueller",
  "name": "MÜLLER BAU GMBH",
  "domains": ["muellerbau.de", "www.muellerbau.de"],
  "enabledFeatures": ["heroSection", "servicesSection", "projectsSection", "ctaSection"],

  "services": [
    {
      "slug": "malerarbeiten",
      "title": "Malerarbeiten",
      "description": "Professional painting services",
      "image": "https://example.com/painting.jpg",
      "measures": ["Surface prep", "Quality materials", "Clean finish"],
      "icon": "🎨"
    }
  ],

  "projects": [
    {
      "slug": "villa-berlin",
      "title": "Villa Renovation - Berlin",
      "description": "Complete renovation of historic villa",
      "image": "/images/projects/villa-berlin.jpg",
      "link": "https://example.com/portfolio/villa"
    }
  ],

  "pages": {
    "home": {
      "title": "Home",
      "sections": [
        {
          "_type": "heroSection",
          "title": "Müller Bau",
          "subtitle": "Berlin",
          "description": "Professional construction services since 1995",
          "image": "https://example.com/hero.jpg",
          "linkText": "Contact Us",
          "linkHref": "/contact"
        },
        {
          "_type": "servicesSection",
          "title": "Our Services",
          "description": "High-quality construction and renovation",
          "services": ["malerarbeiten"]
        },
        {
          "_type": "projectsSection",
          "title": "Featured Projects",
          "description": "See our latest work",
          "projects": ["villa-berlin"],
          "showViewAllButton": true,
          "viewAllButtonText": "View All Projects",
          "viewAllButtonLink": "/projects"
        },
        {
          "_type": "ctaSection",
          "title": "Ready to Start Your Project?",
          "description": "Contact us for a free consultation",
          "primaryButton": {
            "text": "Get Quote",
            "href": "/contact"
          },
          "secondaryButton": {
            "text": "Learn More",
            "href": "/services"
          },
          "backgroundColor": "bg-primary",
          "textColor": "text-primary-foreground"
        }
      ]
    },
    "services": {
      "title": "Services",
      "sections": [
        {
          "_type": "servicesSection",
          "title": "Our Services",
          "description": "Complete range of construction services",
          "services": ["malerarbeiten"]
        }
      ]
    }
  }
}
```

## Supported Section Types

### `heroSection`
```json
{
  "_type": "heroSection",
  "title": "Main Title",
  "subtitle": "Optional subtitle",
  "description": "Hero description text",
  "image": "https://example.com/hero.jpg",
  "linkText": "Call to Action",
  "linkHref": "/contact"
}
```
**Required:** `title`

### `imageSliderSection`
```json
{
  "_type": "imageSliderSection",
  "slides": [
    {
      "image": "https://example.com/slide1.jpg",
      "caption": "Slide 1 caption"
    },
    {
      "image": "/images/slide2.jpg",
      "caption": "Slide 2 caption"
    }
  ],
  "autoplay": true,
  "autoplayInterval": 5000
}
```

### `beforeAfterSection`
```json
{
  "_type": "beforeAfterSection",
  "title": "Our Transformations",
  "description": "See the difference",
  "pairs": [
    {
      "title": "Kitchen Renovation",
      "subtitle": "2024",
      "before": "https://example.com/kitchen-before.jpg",
      "after": "https://example.com/kitchen-after.jpg"
    }
  ],
  "columns": 2,
  "gap": "1rem"
}
```
**Required:** `title`

### `companySection`
```json
{
  "_type": "companySection",
  "title": "About Us",
  "subtitle": "Company subtitle",
  "description": "Company description",
  "image": "https://example.com/company.jpg",
  "subsections": [
    {
      "title": "Quality",
      "description": "We deliver excellence",
      "icon": "✓"
    }
  ]
}
```
**Required:** `title`

### `servicesSection`
```json
{
  "_type": "servicesSection",
  "title": "Our Services",
  "description": "What we offer",
  "services": ["service-slug-1", "service-slug-2"]
}
```
**Required:** `title`  
**Note:** Services are referenced by slug. Define services in the top-level `"services"` array.

### `projectsSection`
```json
{
  "_type": "projectsSection",
  "title": "Projects",
  "description": "Recent work",
  "projects": ["project-slug-1"],
  "showViewAllButton": true,
  "viewAllButtonText": "See All",
  "viewAllButtonLink": "/projects"
}
```
**Required:** `title`  
**Note:** Projects are referenced by slug. Define projects in the top-level `"projects"` array.

### `ctaSection`
```json
{
  "_type": "ctaSection",
  "title": "Get Started Today",
  "description": "Contact us for a free quote",
  "primaryButton": {
    "text": "Contact",
    "href": "/contact"
  },
  "secondaryButton": {
    "text": "Learn More",
    "href": "/about"
  },
  "backgroundColor": "bg-primary",
  "textColor": "text-primary-foreground"
}
```
**Required:** `title`

### `testimonialsSection`
```json
{
  "_type": "testimonialsSection",
  "title": "What Our Clients Say",
  "subtitle": "Testimonials from satisfied customers"
}
```
**Note:** Testimonials are loaded from the `testimonials` array in the JSON, not configured inline. Example structure:
```json
"testimonials": [
  {
    "_id": "testimonial-1",
    "name": "John Smith",
    "company": "ABC Corp",
    "position": "Manager",
    "text": "Great work on our renovation project!",
    "rating": 5
  }
]
```

### `teamSection`
```json
{
  "_type": "teamSection",
  "title": "Our Team",
  "subtitle": "Meet the experts behind our success"
}
```
**Note:** Team members are loaded from the `teamMembers` array in the JSON. Example structure:
```json
"teamMembers": [
  {
    "_id": "member-1",
    "name": "Alice Johnson",
    "position": "Lead Architect",
    "bio": "15 years of experience in construction",
    "specializations": ["Project Management", "Design"],
    "phone": "+49 123 456789",
    "email": "alice@example.com"
  }
]
```

### `faqSection`
```json
{
  "_type": "faqSection",
  "title": "Frequently Asked Questions",
  "subtitle": "Find answers to common questions",
  "showSearch": true
}
```
**Note:** FAQs are loaded from the `faqs` array in the JSON, organized by category. Example structure:
```json
"faqs": [
  {
    "_id": "faq-1",
    "question": "What is your warranty?",
    "answer": "We offer a 2-year warranty on all work",
    "category": "allgemein"
  }
]
```

### `certificationsSection`
```json
{
  "_type": "certificationsSection",
  "title": "Our Certifications",
  "subtitle": "Quality and compliance certifications"
}
```
**Note:** Certifications are loaded from the `certifications` array in the JSON. Example structure:
```json
"certifications": [
  {
    "_id": "cert-1",
    "name": "DIN EN ISO 9001:2015",
    "issuer": "TÜV Rheinland",
    "description": "Quality management certification",
    "certificateNumber": "QMS-12345",
    "validFrom": "2023-01-01",
    "validUntil": "2026-01-01"
  }
]
```

## Image Handling

For any `image` field in sections or documents, you can use:
- **Full URL:** `"https://example.com/image.jpg"` (will be downloaded and uploaded to Sanity)
- **Local path:** `"/images/hero.jpg"` (resolved against `public/images/hero.jpg`)

## `enabledFeatures` (Optional)

- If `enabledFeatures` is empty or missing: all section types are allowed
- If set: only sections whose `_type` is in the array will be rendered
- Example: `"enabledFeatures": ["heroSection", "servicesSection"]` blocks other section types from rendering

## Importing to Sanity

### 1) Set environment variables (write token required)

```bash
export SANITY_PROJECT_ID=your-project-id
export SANITY_DATASET=production
export SANITY_TOKEN=your-write-token
# Optional:
export SANITY_API_VERSION=2025-12-15
```

### 2) Run the importer

```bash
pnpm run sanity:import-static-tenant -- data/static-mueller.json
```

### What the importer does

1. Creates/updates a `client` document with `clientId`, `name`, `domains`, and `enabledFeatures`
2. Creates/updates `service` documents (with image upload if needed)
3. Creates/updates `project` documents (with image upload)
4. Creates/updates `page` documents with sections:
   - Uploads section images (heroSection, imageSliderSection, beforeAfterSection, companySection)
   - Creates references for servicesSection and projectsSection
5. All documents are scoped by `clientId`

### Image upload behavior

- HTTP(S) URLs: downloads and uploads to Sanity assets
- Local paths (e.g. `/images/foo.jpg`): reads from `public/images/foo.jpg` and uploads
- If upload fails, a warning is logged and the image field is omitted

### Limitations

- Legacy HTML-only pages (`contentHtml`) are not converted to Portable Text
- Unknown section types are silently ignored
- Extra fields not defined in the schema are ignored
