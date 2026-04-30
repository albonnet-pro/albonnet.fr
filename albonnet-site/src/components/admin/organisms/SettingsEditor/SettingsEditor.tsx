"use client";

import AdminInput from "@/components/admin/atoms/AdminInput";
import FieldGroup from "@/components/admin/molecules/FieldGroup";
import CardEditor from "@/components/admin/molecules/CardEditor";

export default function SettingsEditor({ data, onChange }: { data: any; onChange: (v: any) => void }) {
  const update = (key: string, val: string) => onChange({ ...data, [key]: val });

  return (
    <div>
      <CardEditor title="Identité">
        <FieldGroup label="Nom de marque" hint="*texte* = couleur accent  ex: Alb*onnet*">
          <AdminInput value={data.brandName} onChange={(e) => update("brandName", e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Email de contact">
          <AdminInput value={data.email} onChange={(e) => update("email", e.target.value)} type="email" />
        </FieldGroup>
        <FieldGroup label="Localisation">
          <AdminInput value={data.location} onChange={(e) => update("location", e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Texte du footer" style={{ marginBottom: 0 }}>
          <AdminInput value={data.footerText} onChange={(e) => update("footerText", e.target.value)} />
        </FieldGroup>
      </CardEditor>
      <CardEditor title="Réseaux sociaux">
        <FieldGroup label="GitHub URL">
          <AdminInput value={data.socialGithub} onChange={(e) => update("socialGithub", e.target.value)} />
        </FieldGroup>
        <FieldGroup label="LinkedIn URL">
          <AdminInput value={data.socialLinkedin} onChange={(e) => update("socialLinkedin", e.target.value)} />
        </FieldGroup>
        <FieldGroup label="Twitter / X URL" style={{ marginBottom: 0 }}>
          <AdminInput value={data.socialTwitter} onChange={(e) => update("socialTwitter", e.target.value)} />
        </FieldGroup>
      </CardEditor>
    </div>
  );
}