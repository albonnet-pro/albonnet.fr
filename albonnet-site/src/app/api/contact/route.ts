import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rateLimit";
import { contactEmailTemplate } from "@/lib/emailTemplates";

const RATE_LIMIT_MAX    = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 heure

export async function POST(req: NextRequest) {
  const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

  const { allowed, remaining, resetAt } = rateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
  if (!allowed) {
    const retryAfter = Math.ceil((resetAt - Date.now()) / 1000);
    return NextResponse.json(
        { error: "Trop de messages envoyés. Réessayez dans une heure." },
        {
          status: 429,
          headers: {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
            "X-RateLimit-Remaining": "0",
          },
        }
    );
  }

  const { name, email, message } = await req.json(); // ← une seule fois

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
  }
  if (typeof name !== "string" || name.length > 100) {
    return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
  }
  if (typeof message !== "string" || message.length > 5000) {
    return NextResponse.json({ error: "Message trop long (max 5000 caractères)" }, { status: 400 });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (typeof email !== "string" || email.length > 254 || !emailRegex.test(email)) {
    return NextResponse.json({ error: "Email invalide" }, { status: 400 });
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: "Service d'email non configuré" }, { status: 503 });
  }
  const to = process.env.CONTACT_EMAIL;
  if (!to) {
    return NextResponse.json({ error: "Destinataire non configuré" }, { status: 503 });
  }

  const { subject, html } = contactEmailTemplate(name, email, message);
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { error } = await resend.emails.send({
      from: `Albonnet.fr <noreply@${process.env.RESEND_DOMAIN || "albonnet.fr"}>`,
      to,
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
    }

    await fetch(`${process.env.NTFY_URL}/${process.env.NTFY_TOPIC}`, {
      method: "POST",
      headers: {
        "Title": "Albonnet.fr - Nouveau message",
        "Priority": "high",
        "Tags": "envelope",
        ...(process.env.NTFY_TOKEN && {
          "Authorization": `Bearer ${process.env.NTFY_TOKEN}`,
        }),
        "Content-Type": "text/plain",
      },
      body: `De : ${name} (${email})\n\nConsultez vos mails afin de lire le contenu du message.`,
    });

    return NextResponse.json({ success: true, remaining });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}