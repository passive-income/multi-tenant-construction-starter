interface TestSectionProps {
  title: string;
  message?: string;
  backgroundColor?: string;
}

export function TestSection({ title, message, backgroundColor = 'bg-blue-50' }: TestSectionProps) {
  return (
    <section className={`py-16 ${backgroundColor}`}>
      <div className="container">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-4 text-4xl">🧪</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {message && <p className="text-lg text-muted-foreground mb-6">{message}</p>}
          <div className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
            Feature Flag Test: ACTIVE
          </div>
          <p className="mt-8 text-sm text-muted-foreground">
            This section is only visible when{' '}
            <code className="px-2 py-1 bg-gray-200 rounded">testSection</code> is in the client's{' '}
            <code className="px-2 py-1 bg-gray-200 rounded">enabledFeatures</code> array.
          </p>
        </div>
      </div>
    </section>
  );
}
