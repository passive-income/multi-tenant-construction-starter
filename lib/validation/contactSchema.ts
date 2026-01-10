import { z } from "zod";
import type { FormField } from "@/lib/types/contactSettings";

// Shared contact form schema - used by both client (react-hook-form) and server (API)
export const contactFormSchema = z.object({
  clientId: z.string(),
  name: z.string().min(1, "Name ist erforderlich"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen lang sein"),
  subject: z.string().optional(),
  company: z.string().optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: "Bitte bestätigen Sie die Datenschutzerklärung" }) }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Generate Zod schema from Sanity formFields definition
 * This allows per-tenant custom validation rules
 */
export function generateSchemaFromFields(fields: FormField[], clientId: string): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {
    clientId: z.string().default(clientId),
    privacy: z.literal(true, { errorMap: () => ({ message: "Bitte bestätigen Sie die Datenschutzerklärung" }) }),
  };

  fields.forEach((field) => {
    let fieldSchema: z.ZodTypeAny;

    switch (field.type) {
      case "email":
        fieldSchema = z.string().email("Ungültige E-Mail-Adresse");
        break;
      case "tel":
        fieldSchema = z.string();
        break;
      case "textarea":
      case "text":
      default:
        fieldSchema = z.string();
    }

    // Apply minLength
    if ((field as any).minLength && typeof (field as any).minLength === "number") {
      fieldSchema = (fieldSchema as z.ZodString).min(
        (field as any).minLength,
        `Mindestens ${(field as any).minLength} Zeichen erforderlich`
      );
    }

    // Apply maxLength
    if ((field as any).maxLength && typeof (field as any).maxLength === "number") {
      fieldSchema = (fieldSchema as z.ZodString).max(
        (field as any).maxLength,
        `Maximal ${(field as any).maxLength} Zeichen erlaubt`
      );
    }

    // Apply pattern (regex)
    if ((field as any).pattern) {
      try {
        const regex = new RegExp((field as any).pattern);
        fieldSchema = (fieldSchema as z.ZodString).regex(regex, "Ungültiges Format");
      } catch (e) {
        console.warn(`Invalid regex pattern for field ${field.name}:`, (field as any).pattern);
      }
    }

    // Make optional if not required
    if (!field.required) {
      fieldSchema = fieldSchema.optional();
    }

    shape[field.name] = fieldSchema;
  });

  return z.object(shape);
}
