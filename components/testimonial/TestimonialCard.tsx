"use client";

import { Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import type { Testimonial } from "@/lib/types/testimonial";
import { urlFor } from "@/sanity/lib/image";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const [expanded, setExpanded] = useState(false);
  const longText = testimonial.text.length > 200;
  const displayText = expanded || !longText 
    ? testimonial.text 
    : `${testimonial.text.slice(0, 200)}...`;

  const imageUrl = testimonial.image?.asset 
    ? urlFor(testimonial.image).width(80).height(80).url() 
    : null;

  return (
    <Card className={`p-6 ${testimonial.featured ? "border-2 border-primary shadow-lg" : ""}`}>
      {testimonial.featured && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
            Hervorgehoben
          </span>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={testimonial.name}
            width={60}
            height={60}
            className="rounded-full object-cover"
          />
        ) : (
          <div className="w-15 h-15 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold">
            {testimonial.name.charAt(0)}
          </div>
        )}
        
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{testimonial.name}</h3>
          {testimonial.company && (
            <p className="text-sm text-muted-foreground">{testimonial.company}</p>
          )}
          {testimonial.position && (
            <p className="text-xs text-muted-foreground">{testimonial.position}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 mb-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < testimonial.rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>

      <p className="text-sm leading-relaxed mb-3">{displayText}</p>

      {longText && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-primary hover:underline"
        >
          {expanded ? "Weniger anzeigen" : "Mehr anzeigen"}
        </button>
      )}

      <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
        {testimonial.date && (
          <span>{new Date(testimonial.date).toLocaleDateString("de-DE")}</span>
        )}
        {testimonial.location && (
          <span> • {testimonial.location}</span>
        )}
      </div>
    </Card>
  );
}
