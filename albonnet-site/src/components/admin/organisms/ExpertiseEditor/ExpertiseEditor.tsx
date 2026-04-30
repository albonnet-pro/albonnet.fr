"use client";

import AdminInput from "@/components/admin/atoms/AdminInput";
import AdminTextArea from "@/components/admin/atoms/AdminTextArea";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import FieldGroup from "@/components/admin/molecules/FieldGroup";
import CardEditor from "@/components/admin/molecules/CardEditor";
import TagInput from "@/components/admin/molecules/TagInput";

export default function ExpertiseEditor({ data, onChange }: { data: any[]; onChange: (v: any[]) => void }) {
  const update = (i: number, key: string, val: any) => {
    const c = [...data]; c[i] = { ...c[i], [key]: val }; onChange(c);
  };
  const remove = (i: number) => onChange(data.filter((_, idx) => idx !== i));
  const add = () => onChange([...data, { label: "Nouvelle catégorie", description: "Description...", items: [] }]);

  return (
    <div>
      {data.map((group, i) => (
        <CardEditor key={i} title={`Catégorie ${i + 1}`} onDelete={() => remove(i)}>
          <FieldGroup label="Titre de la catégorie">
            <AdminInput value={group.label} onChange={(e) => update(i, "label", e.target.value)} />
          </FieldGroup>
          <FieldGroup label="Description (langage accessible)">
            <AdminTextArea value={group.description} onChange={(e) => update(i, "description", e.target.value)} rows={2} />
          </FieldGroup>
          <FieldGroup label="Technologies">
            <TagInput tags={group.items || []} onChange={(items) => update(i, "items", items)} />
          </FieldGroup>
        </CardEditor>
      ))}
      <AdminButton variant="ghost" onClick={add} style={{ width: "100%" }}>
        <AdminIcon name="plus" size={16} /> Ajouter une catégorie
      </AdminButton>
    </div>
  );
}