import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getSiteData } from '@/lib/data'
import { ServicesLoading } from '@/components/loading/ServicesLoading'
import clients from '@/data/clients.json'

async function ServicesContent() {
  const clientName = (await cookies()).get('clientId')?.value
  const clientMeta = clients.find((c: any) => c.name === clientName)
  if (!clientMeta) return <p>No client found</p>

  const data = await getSiteData(clientMeta)
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl mb-8 text-center">Services</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.services.map((s: any) => (
          <div key={s.title} className="p-4 border rounded-lg">
            <h3 className="font-bold text-xl mb-2">{s.title}</h3>
            <p>{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function ServicesPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <ServicesContent />
    </Suspense>
  )
}
