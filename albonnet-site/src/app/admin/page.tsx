"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import BackOffice from "@/components/admin/templates/BackOffice";

export default function AdminPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/admin/login");
    },
  });

  if (status === "loading") {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#101014",
          color: "#8b8998",
          fontFamily: "'General Sans', sans-serif",
        }}
      >
        Chargement...
      </div>
    );
  }

  return <BackOffice userEmail={session?.user?.email || undefined} />;
}
