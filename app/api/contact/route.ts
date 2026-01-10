import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getClient } from "@/sanity/lib/client";
import { contactSettingsQuery } from "@/sanity/queries";
import type { ContactSettings } from "@/lib/types/contactSettings";
import { contactFormSchema } from "@/lib/validation/contactSchema";

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT_MAX = 5; // Max requests
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in ms

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count++;
  return true;
}

// Schema moved to lib/validation/contactSchema.ts for reuse

export async function POST(request: NextRequest) {
  const contentType = request.headers.get("content-type");
  const isFormData = contentType?.includes("form");

  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown";
    
    if (!checkRateLimit(ip)) {
      if (isFormData) {
        return NextResponse.redirect(new URL("/contact?error=rate-limit", request.url));
      }
      return NextResponse.json(
        { message: "Zu viele Anfragen. Bitte versuchen Sie es später erneut." },
        { status: 429 }
      );
    }

    // Handle both formData (native form submission) and JSON (fetch)
    let body: any;
    if (isFormData) {
      const formData = await request.formData();
      body = Object.fromEntries(formData);
      // Convert privacy checkbox to boolean
      body.privacy = body.privacy === "on" || body.privacy === "true";
    } else {
      body = await request.json();
    }
    
    // Validate input
    const validatedData = contactFormSchema.parse(body);

    // Fetch contact settings to get recipient email
    const client = getClient("production");
    const settings: ContactSettings | null = await client.fetch(contactSettingsQuery, {
      clientId: validatedData.clientId,
    });

    if (!settings || !settings.email) {
      console.error("No contact settings or email found for client:", validatedData.clientId);
      return NextResponse.json(
        { message: "Konfigurationsfehler. Bitte kontaktieren Sie uns direkt." },
        { status: 500 }
      );
    }

    // TODO: Implement email sending via SMTP
    // For now, log the data (replace with actual email sending in production)
    console.log("Contact form submission:", {
      to: settings.email,
      from: validatedData.email,
      name: validatedData.name,
      phone: validatedData.phone,
      subject: validatedData.subject || "Neue Kontaktanfrage",
      message: validatedData.message,
      company: validatedData.company,
      timestamp: new Date().toISOString(),
    });

    // TODO: Save to file or database
    // Example: Write to JSON file in /tmp or similar
    const fs = await import("fs/promises");
    const path = await import("path");
    const submissionsDir = path.join(process.cwd(), "submissions");
    
    try {
      await fs.mkdir(submissionsDir, { recursive: true });
      const filename = `${validatedData.clientId}-${Date.now()}.json`;
      await fs.writeFile(
        path.join(submissionsDir, filename),
        JSON.stringify({ ...validatedData, timestamp: new Date().toISOString() }, null, 2)
      );
    } catch (fileError) {
      console.error("Failed to save submission to file:", fileError);
      // Continue anyway - don't fail the request
    }

    // In production, send email via SMTP (e.g., Nodemailer, SendGrid, etc.)
    // Example with Nodemailer:
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.sendMail({
    //   from: process.env.SMTP_FROM,
    //   to: settings.email,
    //   replyTo: validatedData.email,
    //   subject: validatedData.subject || "Neue Kontaktanfrage",
    //   html: `
    //     <h2>Neue Kontaktanfrage</h2>
    //     <p><strong>Name:</strong> ${validatedData.name}</p>
    //     <p><strong>E-Mail:</strong> ${validatedData.email}</p>
    //     ${validatedData.phone ? `<p><strong>Telefon:</strong> ${validatedData.phone}</p>` : ""}
    //     ${validatedData.company ? `<p><strong>Firma:</strong> ${validatedData.company}</p>` : ""}
    //     <p><strong>Nachricht:</strong><br>${validatedData.message.replace(/\n/g, "<br>")}</p>
    //   `,
    // });

    // Return appropriate response based on request type
    if (isFormData) {
      // Native form submission - redirect with success message
      return NextResponse.redirect(new URL("/contact?success=true", request.url));
    }
    
    return NextResponse.json(
      { message: "Ihre Nachricht wurde erfolgreich gesendet." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    if (error instanceof z.ZodError) {
      if (isFormData) {
        return NextResponse.redirect(new URL("/contact?error=validation", request.url));
      }
      return NextResponse.json(
        { message: "Ungültige Formulardaten.", errors: error.errors },
        { status: 400 }
      );
    }

    if (isFormData) {
      return NextResponse.redirect(new URL("/contact?error=server", request.url));
    }
    return NextResponse.json(
      { message: "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut." },
      { status: 500 }
    );
  }
}
