"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#101014",
        fontFamily: "'General Sans', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          padding: "48px 40px",
          background: "#1a1a20",
          borderRadius: "16px",
          border: "1px solid #2a2a34",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/48.svg"
            alt="Albonnet"
            width={48}
            height={48}
            style={{ borderRadius: "10px", marginBottom: "16px" }}
          />
          <h1
            style={{
              fontFamily: "'Clash Display', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "#e8e6e3",
              margin: "0 0 4px",
            }}
          >
            Alb<span style={{ color: "#e8503a" }}>onnet</span>
          </h1>
          <p
            style={{
              fontSize: "0.82rem",
              color: "#5c5a6a",
              fontFamily: "'JetBrains Mono', monospace",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Back-office
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#e8e6e3",
                marginBottom: "6px",
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "0.9rem",
                color: "#e8e6e3",
                background: "#101014",
                border: "1.5px solid #2a2a34",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'General Sans', sans-serif",
              }}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "#e8e6e3",
                marginBottom: "6px",
              }}
            >
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "0.9rem",
                color: "#e8e6e3",
                background: "#101014",
                border: "1.5px solid #2a2a34",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box",
                fontFamily: "'General Sans', sans-serif",
              }}
            />
          </div>

          {error && (
            <p
              style={{
                color: "#f87171",
                fontSize: "0.85rem",
                marginBottom: "16px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              fontSize: "0.9rem",
              fontWeight: 600,
              color: "#fff",
              background: loading ? "#e8503a99" : "#e8503a",
              border: "none",
              borderRadius: "6px",
              cursor: loading ? "wait" : "pointer",
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
