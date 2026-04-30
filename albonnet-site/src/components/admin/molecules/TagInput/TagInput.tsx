"use client";

import { useState } from "react";
import styles from "./TagInput.module.scss";
import AdminInput from "@/components/admin/atoms/AdminInput";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";

export default function TagInput({ tags, onChange }: {
  tags: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = () => {
    const val = input.trim();
    if (val && !tags.includes(val)) {
      onChange([...tags, val]);
      setInput("");
    }
  };

  const remove = (i: number) => onChange(tags.filter((_, idx) => idx !== i));

  return (
    <div>
      {tags.length > 0 && (
        <div className={styles.tags}>
          {tags.map((tag, i) => (
            <span key={i} className={styles.tag}>
              {tag}
              <span onClick={() => remove(i)} className={styles.remove}>×</span>
            </span>
          ))}
        </div>
      )}
      <div className={styles.inputRow}>
        <AdminInput
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ajouter un tag..."
          style={{ flex: 1 }}
        />
        <AdminButton variant="ghost" onClick={add} style={{ whiteSpace: "nowrap" }}>
          <AdminIcon name="plus" size={14} /> Ajouter
        </AdminButton>
      </div>
    </div>
  );
}