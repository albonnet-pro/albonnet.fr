import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Alexis Bonnet - Développeur Web Freelance";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#f5f0eb",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Carré décoratif accent */}
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 80,
            width: 220,
            height: 220,
            border: "2px solid rgba(232,80,58,0.25)",
            transform: "rotate(15deg)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 80,
            left: 80,
            width: 120,
            height: 120,
            borderRadius: "50%",
            border: "2px solid rgba(138,133,121,0.35)",
            display: "flex",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(232,80,58,0.1)",
              border: "1px solid rgba(232,80,58,0.3)",
              borderRadius: 99,
              padding: "8px 20px",
              fontSize: 18,
              color: "#e8503a",
              display: "flex",
            }}
          >
            Développeur Web Freelance
          </div>
        </div>

        {/* Titre */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 700,
            color: "#0a0a0a",
            lineHeight: 1.1,
            marginBottom: 28,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Alexis</span>
          <span>
            Bon<span style={{ color: "#e8503a" }}>net</span>
            <span style={{ color: "#e8503a" }}>.</span>
          </span>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            color: "#3a3a3a",
            maxWidth: 680,
            lineHeight: 1.5,
            display: "flex",
          }}
        >
          Applications performantes, interfaces soignées, code robuste.
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 18,
            color: "#8a8579",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          albonnet.fr
        </div>
      </div>
    ),
    { ...size }
  );
}