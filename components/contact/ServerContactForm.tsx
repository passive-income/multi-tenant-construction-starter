import type { ContactSettings } from "@/lib/types/contactSettings";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ServerContactFormProps {
  settings: ContactSettings;
  searchParams?: { success?: string; error?: string };
}

/**
 * Server-rendered contact form that works without JavaScript.
 * Progressive enhancement: ContactForm.tsx (client) enhances this base form.
 */
export function ServerContactForm({ settings, searchParams }: ServerContactFormProps) {
  const showSuccess = searchParams?.success === "true";
  const errorType = searchParams?.error;

  return (
    <Card className="p-6 md:p-8">
      <form method="post" action="/api/contact" className="space-y-6">
        <input type="hidden" name="clientId" value={settings.clientId} />
        
        {settings.formFields?.map((field) => {
          // Note: conditional visibility requires JS, so we render all fields for SSR fallback
          // Client component will handle hiding/showing dynamically
          
          return (
            <div key={field.name}>
              <label htmlFor={field.name} className="block text-sm font-medium mb-2">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={(field as any).minLength}
                  maxLength={(field as any).maxLength}
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              ) : field.type === "select" ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">Bitte wählen...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type}
                  placeholder={field.placeholder}
                  required={field.required}
                  minLength={(field as any).minLength}
                  maxLength={(field as any).maxLength}
                  pattern={(field as any).pattern}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              )}
            </div>
          );
        })}

        {/* Honeypot field */}
        <div className="hidden">
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        <div className="flex items-start">
          <input
            type="checkbox"
            id="privacy"
            name="privacy"
            required
            className="mt-1 mr-2"
          />
          <label htmlFor="privacy" className="text-sm text-muted-foreground">
            Ich habe die Datenschutzerklärung zur Kenntnis genommen und stimme zu, dass meine
            Angaben zur Kontaktaufnahme und für Rückfragen gespeichert werden. *
          </label>
        </div>

        {showSuccess && (
          <div className="p-4 rounded-md bg-green-50 text-green-800 border border-green-200">
            Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet.
          </div>
        )}

        {errorType && (
          <div className="p-4 rounded-md bg-red-50 text-red-800 border border-red-200">
            {errorType === "validation" && "Bitte überprüfen Sie Ihre Eingaben."}
            {errorType === "rate-limit" && "Zu viele Anfragen. Bitte versuchen Sie es später erneut."}
            {errorType === "server" && "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut."}
          </div>
        )}

        <Button type="submit" className="w-full">
          Nachricht senden
        </Button>
      </form>
    </Card>
  );
}
