"use client";

import styles from "./AdminHeader.module.scss";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import AdminBadge from "@/components/admin/atoms/AdminBadge";

interface AdminHeaderProps {
  title: string;
  description: string;
  hasChanges: boolean;
  onToggleSidebar: () => void;
  onSave: () => void;
  onReload: () => void;
}

export default function AdminHeader({
  title, description, hasChanges, onToggleSidebar, onSave, onReload,
}: AdminHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerLeft}>
        <button onClick={onToggleSidebar} className={styles.hamburger}>
          <AdminIcon name="menu" size={18} />
        </button>
        <div>
          <h1 className={styles.sectionTitle}>{title}</h1>
          <p className={styles.sectionDesc}>{description}</p>
        </div>
      </div>
      <div className={styles.headerRight}>
        <span className={styles.unsavedBadge}>
          {hasChanges && <AdminBadge color="#fbbf24">Non sauvegardé</AdminBadge>}
        </span>
        <span className={styles.reloadBtn}>
          <AdminButton variant="ghost" onClick={onReload}>Recharger</AdminButton>
        </span>
        <AdminButton variant="primary" onClick={onSave} disabled={!hasChanges}>
          <AdminIcon name="save" size={16} />
          <span className={styles.saveLabel}>Enregistrer</span>
        </AdminButton>
      </div>
    </header>
  );
}
