Static Tenant JSON (Sanity-like)

Goal

Keep one shared codebase, but allow each tenant to have a “static mode” JSON file that behaves like Sanity (ordered page sections). When the tenant later wants to move to Sanity, you can import the same structure with a script.

Static JSON formats supported

1) New (recommended): pages as a map keyed by slug

- Put a tenant file in data/, e.g. data/static-mueller.json (or data/static-<tenant>.json)
- Add a pages object:

{
  "clientId": "mueller",
  "domains": ["muellerbau.de"],
  "enabledFeatures": ["heroSection", "servicesSection", "projectsSection"],
  "pages": {
    "home": {
      "title": "Home",
      "sections": [
        {
          "_type": "heroSection",
          "title": "Müller Bau",
          "subtitle": "Berlin",
          "description": "…",
          "image": "https://…",
          "linkText": "Kontakt",
          "linkHref": "/contact"
        },
        {
          "_type": "servicesSection",
          "title": "Leistungen",
          "description": "…",
          "services": ["malerarbeiten", "bodenbelaege"]
        }
      ]
    },
    "services": {
      "title": "Services",
      "sections": [
        { "_type": "servicesSection", "title": "Unsere Leistungen", "services": ["malerarbeiten"] }
      ]
    }
  },
  "services": [
    { "slug": "malerarbeiten", "title": "Malerarbeiten", "description": "…", "image": "https://…" }
  ],
  "projects": [
    { "slug": "projekt-a", "title": "Projekt A", "description": "…", "images": ["https://…"] }
  ]
}

Notes

- For section image fields (heroSection, companySection, imageSliderSection, before/after pairs), you can use either:
  - a full http(s) URL, or
  - a local path (e.g. /images/foo.jpg which will be resolved against public/images/foo.jpg)

2) Legacy: pages as an array

Some routes previously used:

"pages": [
  { "slug": "impressum", "title": "Impressum", "contentHtml": "<p>…</p>" }
]

This is still supported, but it is not “Sanity-like sections”. For best migration, prefer sections.

enabledFeatures

- enabledFeatures is an optional allow-list.
- If enabledFeatures is empty/missing: all section types are allowed.
- If enabledFeatures is set: sections whose _type is not included will be ignored.

Importing static JSON into Sanity

1) Set environment variables (write token required)

- SANITY_PROJECT_ID
- SANITY_DATASET
- SANITY_TOKEN
- optional: SANITY_API_VERSION

2) Run the importer

pnpm run sanity:import-static-tenant -- data/static-mueller.json

What it does

- Creates/updates service and project documents for the tenant
- Creates/updates page documents using pages[*].sections
- Uploads images when a section/image field is a string URL/path
- Creates/updates a client document with domains + enabledFeatures

Limitations

- HTML-only legacy pages (contentHtml/descriptionHtml) are not converted into Portable Text blocks by this importer.
  If you want, we can add a dedicated richTextSection schema + importer mapping.
