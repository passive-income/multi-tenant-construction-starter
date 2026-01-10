import React from 'react';

// Minimal renderer for Sanity Portable Text without external deps
// Supports headings, paragraphs, lists, and basic marks (strong/em)
export default function PortableTextLite({ value }: { value: any[] }) {
  if (!Array.isArray(value) || value.length === 0) return null;

  const renderMarks = (text: string, marks: string[] | undefined) => {
    let out: React.ReactNode = text;
    if (Array.isArray(marks)) {
      marks.forEach((m) => {
        if (m === 'strong') out = <strong>{out}</strong>;
        if (m === 'em') out = <em>{out}</em>;
      });
    }
    return out;
  };

  const renderBlock = (block: any, idx: number) => {
    const children = Array.isArray(block?.children)
      ? block.children.map((span: any, i: number) => (
          <React.Fragment key={i}>{renderMarks(span?.text ?? '', span?.marks)}</React.Fragment>
        ))
      : null;

    switch (block?.style) {
      case 'h1':
        return (
          <h1 key={idx} className="text-3xl font-bold mb-4">
            {children}
          </h1>
        );
      case 'h2':
        return (
          <h2 key={idx} className="text-2xl font-semibold mb-3">
            {children}
          </h2>
        );
      case 'h3':
        return (
          <h3 key={idx} className="text-xl font-semibold mb-2">
            {children}
          </h3>
        );
      default:
        return (
          <p key={idx} className="text-lg text-muted-foreground mb-3">
            {children}
          </p>
        );
    }
  };

  // Handle lists (assuming list blocks shape from Portable Text)
  const renderList = (listBlock: any, idx: number) => {
    const isBullet = listBlock?.listItem === 'bullet';
    const Tag = isBullet ? 'ul' : 'ol';
    const content = Array.isArray(listBlock?.children)
      ? listBlock.children.map((span: any, _i: number) => span?.text ?? '')
      : [];
    return (
      <Tag key={idx} className="pl-6 mb-3 list-disc">
        <li>{content.join('')}</li>
      </Tag>
    );
  };

  return (
    <div>
      {value.map((block: any, idx: number) =>
        block?.listItem ? renderList(block, idx) : renderBlock(block, idx),
      )}
    </div>
  );
}
