# Sanity Import Documentation

This directory contains JSON files with sample data for importing into Sanity CMS.

## Available Files

### 1. mueller-docs.json
Static data for Müller Bau (single tenant example)
- Company, footer, client, and sample services

### 2. dummy-multi-tenant.json
Complete multi-tenant sample data with DACH features
- Two clients: Alpha Construction (alpha) and Beta Builders (beta)
- All schema types including:
  - Company, footer, navigation, pages
  - Services and projects
  - **Testimonials** (customer reviews with ratings)
  - **FAQs** (categorized frequently asked questions)
  - **Contact Settings** (dynamic form configuration)
  - **Team Members** (staff profiles)
  - **Certifications** (company qualifications)

## Import Instructions

### Prerequisites

1. Install the Sanity CLI if you don't have it:

```bash
npm install -g @sanity/cli
```

2. Make sure you're in your project directory and authenticated with Sanity:

```bash
sanity login
```

### Import Commands

#### Import Multi-Tenant Data (Recommended)

```bash
sanity dataset import ./scripts/sanity-import/dummy-multi-tenant.json production --replace
```

#### Import Müller Static Data

```bash
sanity dataset import ./scripts/sanity-import/mueller-docs.json production --replace
```

#### Import Without Replacing Existing Data

Remove the `--replace` flag to merge instead of replacing:

```bash
sanity dataset import ./scripts/sanity-import/dummy-multi-tenant.json production
```

### Alternative Command (Older CLI Versions)

If `sanity dataset import` doesn't work, try:

```bash
sanity documents import ./scripts/sanity-import/dummy-multi-tenant.json production
```

## Data Structure

### dummy-multi-tenant.json Contents

**Alpha Construction (clientId: "alpha")**
- 3 testimonials (Michael Schmidt, Andrea Weber, Thomas Müller)
- 5 FAQs (covering all categories: Allgemein, Leistungen, Kosten, Zeitplan, Garantie)
- Contact settings with 6 form fields
- 3 team members (Hans Müller, Sarah Klein, Marcus Weber)
- 2 certifications (ISO 9001, Meisterbetrieb)

**Beta Builders (clientId: "beta")**
- 2 testimonials (Robert Fischer, Julia Hoffmann)
- 2 FAQs
- Contact settings with 4 form fields
- 1 team member (Peter Schwarz)
- 1 certification (Fachbetrieb nach WHG)

## Post-Import Steps

1. **Verify Import**: Check Sanity Studio to confirm all documents imported correctly
2. **Upload Images**: The sample data doesn't include actual images. Upload images via Studio for:
   - Team member photos
   - Certification logos
   - Testimonial avatars (optional)
3. **Test Multi-Tenant Filtering**: Ensure each client only sees their own data
4. **Configure Domains**: Update client domains in Studio to match your local/production domains

## Notes

- All documents use `clientId` field for multi-tenant filtering
- FAQs use portable text for answers (allows rich text formatting)
- Team member bios also use portable text
- Contact form fields are dynamically configured per client
- Certifications include validity dates for automatic expiry detection
- Testimonials can be marked as "featured" for homepage display

## Troubleshooting

**Error: Dataset not found**
- Create the dataset first: `sanity dataset create production`

**Error: Schema mismatch**
- Ensure your schema files are up to date
- Deploy your schema: `sanity schema deploy`

**Import hangs or fails**
- Check file encoding (should be UTF-8)
- Validate JSON syntax
- Ensure all referenced `_ref` IDs exist in the file
