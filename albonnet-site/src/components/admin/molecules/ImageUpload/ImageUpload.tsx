"use client";

import { useRef } from "react";
import styles from "./ImageUpload.module.scss";
import AdminButton from "@/components/admin/atoms/AdminButton";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function ImageUpload({ value, onChange }: {
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, handleFile } = useImageUpload(onChange);

  return (
    <div>
      {value && (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Aperçu" className={styles.image} />
          <button onClick={() => onChange("")} className={styles.remove}>×</button>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      <AdminButton
        variant="ghost"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        style={{ width: "100%" }}
      >
        {uploading ? "Envoi en cours…" : value ? "Changer l'image" : "Choisir un fichier"}
      </AdminButton>
    </div>
  );
}
