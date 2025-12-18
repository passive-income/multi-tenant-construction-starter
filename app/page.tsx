import { Suspense } from 'react'
import { cookies } from 'next/headers'
import { getSiteData } from '@/lib/data'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { DataContent } from '@/components/DataContent'
import { CompanySectionLoading } from '@/components/loading/CompanySectionLoading'
import { PreloadLCPImage } from '@/components/PreloadLCPImage'
import clients from '@/data/clients.json'

async function HomePageContent() {
  const clientName = (await cookies()).get('clientId')?.value
  const clientMeta = clients.find((c: any) => c.name === clientName)
  if (!clientMeta) return <p>No client found</p>

  const data = await getSiteData(clientMeta)

  return <DataContent data={data} />
}

export default async function HomePage() {
  const clientName = (await cookies()).get('clientId')?.value
  const clientMeta = clients.find((c: any) => c.name === clientName)
  
  if (!clientMeta) {
    return (
      <>
        <Header />
        <main>
          <p>No client found</p>
        </main>
        <Footer />
      </>
    )
  }

  const data = await getSiteData(clientMeta)
  const firstSlideImage = data.slider?.slides?.[0]?.image

  return (
    <>
      {firstSlideImage && <PreloadLCPImage src={firstSlideImage} />}
      <Header logoText={data.company?.logoText || data.company?.name} />
      <Suspense fallback={
        <main>
          <CompanySectionLoading />
        </main>
      }>
        <HomePageContent />
      </Suspense>
      <Footer footer={data.footer} />
    </>
  )
}
