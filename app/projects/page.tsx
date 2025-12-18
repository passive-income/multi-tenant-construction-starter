import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getSiteData } from '@/lib/data'
import { ProjectGallery } from '@/components/ProjectGallery'
import { ProjectsLoading } from '@/components/loading/ProjectsLoading'
import clients from '@/data/clients.json'

async function ProjectsContent() {
  const clientName = (await cookies()).get('clientId')?.value
  const clientMeta = clients.find((c: any) => c.name === clientName)
  if (!clientMeta) return <p>No client found</p>

  const data = await getSiteData(clientMeta)
  return (
    <section className="py-16">
      <h2 className="text-3xl mb-8 text-center">Projects</h2>
      <ProjectGallery images={data.projects.map((p: any) => p.images).flat()} />
    </section>
  )
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsContent />
    </Suspense>
  )
}
