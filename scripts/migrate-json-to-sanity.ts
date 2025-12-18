import fs from 'fs/promises'
import path from 'path'
import { createClient } from 'next-sanity'


const client = createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    apiVersion: '2025-12-15',
    token: process.env.SANITY_TOKEN,
    useCdn: false,
})


async function migrate(clientName: string) {
    const filePath = path.join(process.cwd(), 'data', `${clientName}.json`)
    const raw = await fs.readFile(filePath, 'utf-8')
    const data = JSON.parse(raw)


    await client.createOrReplace({
        _id: `siteSettings-${clientName}`,
        _type: 'siteSettings',
        ...data.company,
        theme: data.theme,
    })


    for (const s of data.services) {
        await client.createOrReplace({
            _id: `service-${clientName}-${s.title.replace(/\s+/g, '-')}`,
            _type: 'service',
            clientId: clientName,
            ...s,
        })
    }


    for (const p of data.projects) {
        await client.createOrReplace({
            _id: `project-${clientName}-${p.title.replace(/\s+/g, '-')}`,
            _type: 'project',
            clientId: clientName,
            ...p,
        })
    }


    console.log(`Migration complete for ${clientName}`)
}


const clientName = process.argv[2]
if (!clientName) throw new Error('Client name is required')
migrate(clientName)