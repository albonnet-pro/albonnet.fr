"use client";

import Link from "next/link";
import { tokens } from "@/lib/tokens";
import { GrainOverlay, DotGrid, Badge } from "@/components/site/atoms";

export default function NotFound() {
  return (
    <div
      style={{
        fontFamily: tokens.fonts.body,
        background: tokens.colors.paper,
        color: tokens.colors.ink,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <GrainOverlay />
      <DotGrid />

      {/* Blob décoratif */}
      <div
        style={{
          position: "absolute",
          right: "-10%",
          top: "-20%",
          width: "clamp(300px, 45vw, 700px)",
          height: "clamp(300px, 45vw, 700px)",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${tokens.colors.accent}15 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: "5%",
          bottom: "10%",
          width: 160,
          height: 160,
          border: `2px solid ${tokens.colors.subtle}`,
          borderRadius: tokens.radius.lg,
          transform: "rotate(12deg)",
          pointerEvents: "none",
        }}
      />

      {/* Contenu */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          padding: "0 clamp(24px, 6vw, 80px)",
          maxWidth: 640,
        }}
      >
        <Badge style={{ marginBottom: "32px" }}>Erreur 404</Badge>

        <div
          style={{
            fontFamily: tokens.fonts.display,
            fontSize: "clamp(7rem, 20vw, 14rem)",
            fontWeight: 700,
            lineHeight: 1,
            color: tokens.colors.ink,
            letterSpacing: "-0.04em",
            marginBottom: "16px",
            position: "relative",
          }}
        >
          4
          <span style={{ color: tokens.colors.accent }}>0</span>
          4
        </div>

        <p
          style={{
            fontFamily: tokens.fonts.body,
            fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
            color: tokens.colors.muted,
            lineHeight: 1.6,
            marginBottom: "40px",
          }}
        >
          Cette page n'existe pas ou a été déplacée.
          <br />
          Revenez à l'accueil pour continuer.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: tokens.fonts.body,
            fontSize: "0.95rem",
            fontWeight: 600,
            padding: "14px 36px",
            borderRadius: tokens.radius.full,
            background: tokens.colors.accent,
            color: "#fff",
            textDecoration: "none",
            letterSpacing: "0.02em",
            boxShadow: `0 4px 16px ${tokens.colors.accent}33`,
            transition: "all 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = tokens.colors.accentDark;
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 12px 32px ${tokens.colors.accent}55`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.background = tokens.colors.accent;
            (e.currentTarget as HTMLAnchorElement).style.transform = "none";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 4px 16px ${tokens.colors.accent}33`;
          }}
        >
          ← Retour à l'accueil
        </Link>

        <div
          style={{
            marginTop: "48px",
            fontFamily: tokens.fonts.mono,
            fontSize: "0.72rem",
            color: tokens.colors.subtle,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          albonnet.dev - page introuvable
        </div>
      </div>
    </div>
  );
}
