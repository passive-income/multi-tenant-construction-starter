"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ContactSettings, FormField } from "@/lib/types/contactSettings";
import { contactFormSchema, type ContactFormData } from "@/lib/validation/contactSchema";

interface ContactFormProps {
  settings: ContactSettings;
}

export function ContactForm({ settings }: ContactFormProps) {
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Build list of fields that have visibleIf dependencies
  const fieldsWithDeps = useMemo(() => {
    return (settings.formFields || []).filter(f => (f as any).visibleIf?.field);
  }, [settings.formFields]);
  
  const depFields = useMemo(() => {
    return Array.from(new Set(fieldsWithDeps.map(f => (f as any).visibleIf.field)));
  }, [fieldsWithDeps]);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      clientId: settings.clientId,
    },
  });

  // Only watch fields that have dependent conditional logic
  const watchedFields = watch(depFields.length > 0 ? depFields : []);

  const onSubmit = async (values: ContactFormData) => {
    if (honeypot) {
      console.warn("Bot detected");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet." });
        reset();
      } else {
        setMessage({ type: "error", text: result.message || "Ein Fehler ist aufgetreten." });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    const baseClasses =
      "w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent";

    switch (field.type) {
      case "textarea":
        return (
          <textarea
            id={field.name}
            placeholder={field.placeholder}
            className={baseClasses}
            {...register(field.name as any)}
            rows={5}
          />
        );
      case "select":
        return (
          <select id={field.name} className={baseClasses} {...register(field.name as any)}>
            <option value="">Bitte wählen...</option>
            {field.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      default:
        return (
          <input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            className={baseClasses}
            {...register(field.name as any)}
          />
        );
    }
  };

  return (
    <Card className="p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {settings.formFields?.map((field) => {
          // conditional visibility support: `visibleIf` = { field: string, value: string }
          const visibleIf = (field as any).visibleIf;
          if (visibleIf && visibleIf.field) {
            const depValue = Array.isArray(watchedFields) 
              ? watchedFields[depFields.indexOf(visibleIf.field)]
              : watchedFields;
            if (depValue !== visibleIf.value) return null;
          }

          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {errors?.[field.name as keyof ContactFormData] && (
                <p className="text-xs text-red-600 mt-1">
                  {errors[field.name as keyof ContactFormData]?.message}
                </p>
              )}
            </div>
          );
        })}

        {/* Honeypot field */}
        <div className="hidden">
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            {...register("privacy")}
            className="mt-1 mr-2"
          />
          <label htmlFor="privacy" className="text-sm text-muted-foreground">
            Ich habe die Datenschutzerklärung zur Kenntnis genommen und stimme zu, dass meine
            Angaben zur Kontaktaufnahme und für Rückfragen gespeichert werden. *
          </label>
        </div>
        {errors.privacy && (
          <p className="text-xs text-red-600 -mt-4">{errors.privacy.message}</p>
        )}

        {message && (
          <div
            className={`p-4 rounded-md ${
              message.type === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Wird gesendet..." : "Nachricht senden"}
        </Button>
      </form>
    </Card>
  );
}
