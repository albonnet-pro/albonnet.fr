"use client";

import AdminInput from "@/components/admin/atoms/AdminInput";
import AdminTextArea from "@/components/admin/atoms/AdminTextArea";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import FieldGroup from "@/components/admin/molecules/FieldGroup";
import CardEditor from "@/components/admin/molecules/CardEditor";

export default function ServicesEditor({ data, onChange }: { data: any[]; onChange: (v: any[]) => void }) {
  const update = (i: number, key: string, val: any) => {
    const c = [...data]; c[i] = { ...c[i], [key]: val }; onChange(c);
  };
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const add = () => onChange([...data, { title: "Nouveau service", description: "Description du service...", icon: "layers" }]);

  return (
    <div>
      {data.map((svc, i) => (
        <CardEditor key={i} title={`Service ${i + 1}`} onDelete={() => remove(i)}>
          <FieldGroup label="Titre">
            <AdminInput value={svc.title} onChange={(e) => update(i, "title", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Description">
            <AdminTextArea value={svc.description} onChange={(e) => update(i, "description", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Icône" hint="layers, grid, zap, pen">
            <AdminInput value={svc.icon} onChange={(e) => update(i, "icon", e.target.value)} />
          </FieldGroup>
        </CardEditor>
      ))}
      <AdminButton variant="ghost" onClick={add} style={{ width: "100%" }}>
        <AdminIcon name="plus" size={16} /> Ajouter un service
      </AdminButton>
    </div>
  );
}