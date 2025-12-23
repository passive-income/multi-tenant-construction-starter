import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getSiteData } from '@/lib/data'
import { ServicesLoading } from '@/components/loading/ServicesLoading'
import clients from '@/data/clients.json'

async function CompanyContent() {
  const clientName = (await cookies()).get('clientId')?.value
  const clientMeta = clients.find((c: any) => c.name === clientName)
  if (!clientMeta) return <p>No client found</p>

  const data = await getSiteData(clientMeta)
  return (
    <section className="container py-16 bg-gray-50">
      <h2 className="text-3xl mb-8 text-center">Unternehmen</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.companyDetails?.map((c: any) => (
          <div key={c.title} className="p-4 border rounded-lg bg-white">
            {c.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt={c.title} className="w-full h-40 object-cover mb-4 rounded" />
            )}
            <h3 className="font-bold text-xl mb-1">{c.title}</h3>
            {c.subtitle && <h4 className="text-sm text-gray-600 mb-2">{c.subtitle}</h4>}
            <p className="text-sm text-gray-700">{c.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function CompanyPage() {
  return (
    <Suspense fallback={<ServicesLoading />}>
      <CompanyContent />
    </Suspense>
  )
}