export async function sendContactForm(name: string, email: string, message: string): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
