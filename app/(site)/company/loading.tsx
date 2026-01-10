import { CompanySectionLoading } from '@/components/loading/CompanySectionLoading';

export default function Loading() {
  return (
    <section className="container py-16 bg-gray-50">
      <div className="h-10 w-64 bg-muted animate-pulse rounded mx-auto mb-8"></div>
      <CompanySectionLoading />
    </section>
  );
}
