export function PreloadLCPImage({ src }: { src: string }) {
  if (!src) return null;

  // Escape the src for use in script
  const escapedSrc = src.replace(/'/g, "\\'").replace(/"/g, "&quot;");

  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            var link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = '${escapedSrc}';
            link.setAttribute('fetchpriority', 'high');
            if (document.head) {
              document.head.insertBefore(link, document.head.firstChild);
            } else {
              document.addEventListener('DOMContentLoaded', function() {
                document.head.insertBefore(link, document.head.firstChild);
              });
            }
          })();
        `,
      }}
    />
  );
}
