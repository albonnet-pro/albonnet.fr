function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export function contactEmailTemplate(
  name: string,
  email: string,
  message: string
): { subject: string; html: string } {
  const safeName    = escapeHtml(name);
  const safeEmail   = escapeHtml(email);
  const safeMessage = escapeHtml(message);

  return {
    subject: `Nouveau message de ${safeName}`,
    html: `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0;padding:0;background:#f5f0eb;font-family:'General Sans',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 10px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07);">

          <!-- Header -->
          <tr>
            <td style="background:#0a0a0a;padding:32px 40px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="vertical-align:middle;">
                    <img src="https://albonnet.fr/icons/icon-32.png" alt="Albonnet" width="32" height="32"
                      style="display:block;border-radius:6px;" />
                  </td>
                  <td style="padding-left:12px;vertical-align:middle;">
                    <span style="color:#f5f0eb;font-weight:700;font-size:18px;">albonnet.fr</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:36px 40px 0;">
              <h1 style="margin:0;font-size:22px;font-weight:700;color:#0a0a0a;">
                Nouveau message de contact
              </h1>
              <div style="margin-top:8px;width:40px;height:3px;background:#e8503a;border-radius:2px;"></div>
            </td>
          </tr>

          <!-- Sender info -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                style="border:1px solid #e8e3dc;border-radius:8px;overflow:hidden;">
                <tr>
                  <td style="padding:12px 16px;background:#f5f0eb;width:80px;">
                    <span style="font-size:12px;font-weight:600;color:#8a8579;text-transform:uppercase;letter-spacing:0.05em;">Nom</span>
                  </td>
                  <td style="padding:12px 16px;border-left:1px solid #e8e3dc;">
                    <span style="font-size:15px;color:#0a0a0a;font-weight:500;">${safeName}</span>
                  </td>
                </tr>
                <tr style="border-top:1px solid #e8e3dc;">
                  <td style="padding:12px 16px;background:#f5f0eb;">
                    <span style="font-size:12px;font-weight:600;color:#8a8579;text-transform:uppercase;letter-spacing:0.05em;">Email</span>
                  </td>
                  <td style="padding:12px 16px;border-left:1px solid #e8e3dc;">
                    <a href="mailto:${safeEmail}"
                      style="font-size:15px;color:#e8503a;text-decoration:none;">${safeEmail}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:24px 40px 0;">
              <p style="margin:0 0 10px;font-size:12px;font-weight:600;color:#8a8579;text-transform:uppercase;letter-spacing:0.05em;">
                Message
              </p>
              <div style="background:#f5f0eb;border-left:3px solid #e8503a;border-radius:0 8px 8px 0;padding:20px 24px;">
                <p style="margin:0;font-size:15px;color:#3a3a3a;line-height:1.7;white-space:pre-wrap;">${safeMessage}</p>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="padding:28px 40px 0;">
              <a href="mailto:${safeEmail}"
                style="display:inline-block;background:#e8503a;color:#ffffff;text-decoration:none;
                       font-size:14px;font-weight:600;padding:12px 24px;border-radius:8px;margin-bottom: 24px;">
                Répondre à ${safeName}
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 40px;border-top:1px solid #e8e3dc;margin:24px 0 0;">
              <p style="margin:0;font-size:12px;color:#8a8579;">
                Message reçu via le formulaire de contact d'<a href="https://albonnet.fr"
                  style="color:#e8503a;text-decoration:none;">albonnet.fr</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim(),
  };
}