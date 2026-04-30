/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },

  async headers() {
    // Content-Security-Policy
    // Next.js utilise des scripts inline pour l'hydratation → unsafe-inline requis.
    // unsafe-eval est nécessaire pour certains modules React en dev mais retiré en prod.
    const isDev = process.env.NODE_ENV === "development";

    const csp = [
      "default-src 'self'",
      // Scripts : self + inline (hydratation Next.js) + eval en dev uniquement
      isDev
        ? "script-src 'self' 'unsafe-inline' 'unsafe-eval'"
        : "script-src 'self' 'unsafe-inline'",
      // Styles : inline autorisé (CSS Modules + styles inline React)
      "style-src 'self' 'unsafe-inline'",
      // Images : self + data (base64) + blob (canvas/upload preview)
      "img-src 'self' data: blob: https:",
      // Fonts : self uniquement (fonts hébergées localement)
      "font-src 'self'",
      // Connexions : self + wss pour le HMR Next.js en dev
      isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
      // Iframes : aucune
      "frame-src 'none'",
      "frame-ancestors 'none'",
      // Formulaires : self uniquement
      "form-action 'self'",
      // Base URI : self uniquement (protection contre injection de base tag)
      "base-uri 'self'",
      // Upgrade les requêtes HTTP en HTTPS en prod
      !isDev ? "upgrade-insecure-requests" : "",
    ]
      .filter(Boolean)
      .join("; ");

    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy",   value: csp },
          { key: "X-Frame-Options",            value: "DENY" },
          { key: "X-Content-Type-Options",     value: "nosniff" },
          { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=(), payment=()" },
          // Force HTTPS pendant 1 an (HSTS) - activer seulement si le domaine est 100% HTTPS
          { key: "Strict-Transport-Security",  value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
