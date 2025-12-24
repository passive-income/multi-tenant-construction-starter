Sanity import instructions for Müller static data

Files:
- mueller-docs.json — array of Sanity documents (company, footer, client, sample services).

To import into a Sanity project you can use the Sanity CLI.

1) Install the Sanity CLI if you don't have it:

```bash
npm install -g @sanity/cli
```

2) From your Sanity studio project (or where `sanity` CLI is configured), run:

```bash
sanity dataset import ./scripts/sanity-import/mueller-docs.json <dataset> --replace
```

If `sanity dataset import` is not appropriate, you can use `sanity documents import` (check your CLI version):

```bash
sanity documents import ./scripts/sanity-import/mueller-docs.json <dataset>
```

Notes:
- The supplied documents use simple fields matching the project's schemas; you may need to adapt field names (images in Sanity should be uploaded via the Studio to create proper `image` objects).
- After import, confirm the `client` document exists and points to the created `company` and `footer` documents. If needed, adjust `_id` values to avoid collisions.
