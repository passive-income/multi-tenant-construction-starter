import { PortableText } from '@portabletext/react';
import { Mail, Phone } from 'lucide-react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import type { TeamMember } from '@/lib/types/teamMember';
import { urlFor } from '@/sanity/lib/image';

const portableTextComponents = {
  types: {
    // Fallback for unknown types to prevent errors
  },
  block: {
    normal: ({ children }: any) => <p className="mb-4 text-muted-foreground">{children}</p>,
    h1: ({ children }: any) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
    h2: ({ children }: any) => <h2 className="text-xl font-bold mb-3">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-lg font-semibold mb-2">{children}</h3>,
  },
  marks: {
    strong: ({ children }: any) => <strong>{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
  },
};

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {member.image && (
        <div className="relative w-full aspect-4/5">
          <Image
            src={urlFor(member.image).width(400).height(500).url()}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
        <p className="text-primary font-medium mb-4">{member.position}</p>

        {member.bio && (
          <div className="prose prose-sm max-w-none mb-4 flex-1">
            <PortableText value={member.bio} components={portableTextComponents} />
          </div>
        )}

        {member.specializations && member.specializations.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium mb-2">Fachgebiete:</p>
            <div className="flex flex-wrap gap-2">
              {member.specializations.map((spec, idx) => (
                <span
                  key={`${member._id}-spec-${idx}`}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2 text-sm">
          {member.phone && (
            <div className="flex items-center text-muted-foreground">
              <Phone className="h-4 w-4 mr-2" />
              <a href={`tel:${member.phone}`} className="hover:text-primary">
                {member.phone}
              </a>
            </div>
          )}
          {member.email && (
            <div className="flex items-center text-muted-foreground">
              <Mail className="h-4 w-4 mr-2" />
              <a href={`mailto:${member.email}`} className="hover:text-primary">
                {member.email}
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
