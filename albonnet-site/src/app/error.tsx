"use client";

import { useEffect } from "react";
import { tokens } from "@/lib/tokens";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

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
        flexDirection: "column",
        gap: "24px",
        padding: "40px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: tokens.fonts.display,
          fontSize: "clamp(3rem, 8vw, 6rem)",
          fontWeight: 700,
          lineHeight: 1,
          color: tokens.colors.ink,
        }}
      >
        5<span style={{ color: tokens.colors.accent }}>0</span>0
      </div>
      <p style={{ fontSize: "1.1rem", color: tokens.colors.muted, maxWidth: 480 }}>
        Une erreur inattendue s&apos;est produite. L&apos;équipe a été notifiée.
      </p>
      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={reset}
          style={{
            padding: "12px 28px",
            borderRadius: tokens.radius.full,
            background: tokens.colors.accent,
            color: "#fff",
            border: "none",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
        <a
          href="/"
          style={{
            padding: "12px 28px",
            borderRadius: tokens.radius.full,
            background: "transparent",
            color: tokens.colors.ink,
            border: `1px solid ${tokens.colors.subtle}`,
            fontSize: "0.95rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Retour à l&apos;accueil
        </a>
      </div>
    </div>
  );
}
