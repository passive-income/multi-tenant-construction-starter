#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { createClient } = require("next-sanity");

(async () => {
  try {
    const file =
      process.argv[2] || path.resolve(__dirname, "dummy-multi-tenant.json");
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
    const apiVersion =
      process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-12-17";
    const token = process.env.SANITY_TOKEN || process.env.SANITY_API_TOKEN;

    if (!projectId || !dataset || !token) {
      console.error(
        "Missing environment variables. Set NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET and SANITY_TOKEN.",
      );
      process.exit(1);
    }

    const client = createClient({
      projectId,
      dataset,
      apiVersion,
      token,
      useCdn: false,
    });

    const raw = fs.readFileSync(file, "utf8");
    const docs = JSON.parse(raw);

    console.log(
      `Uploading ${docs.length} documents to ${projectId}/${dataset}...`,
    );

    for (const doc of docs) {
      if (doc._id) {
        await client.createOrReplace(doc);
        console.log(`Upserted ${doc._type} ${doc._id}`);
      } else {
        await client.create(doc);
        console.log(`Created ${doc._type}`);
      }
    }

    const clients = docs
      .filter((d) => d._type === "client")
      .map((d) => d.clientId);
    for (const cid of clients) {
      const services = await client.fetch(
        '*[_type == "service" && clientId == $cid]{_id, title}',
        { cid },
      );
      const projects = await client.fetch(
        '*[_type == "project" && clientId == $cid]{_id, title}',
        { cid },
      );
      console.log(
        `Client '${cid}': services=${services.length}, projects=${projects.length}`,
      );
    }

    console.log("Import and verification complete.");
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
