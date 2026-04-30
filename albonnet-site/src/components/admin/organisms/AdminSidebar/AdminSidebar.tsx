"use client";

import { signOut } from "next-auth/react";
import styles from "./AdminSidebar.module.scss";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import SidebarItem from "@/components/admin/molecules/SidebarItem";
import { IconName } from "@fortawesome/fontawesome-svg-core";

interface SidebarSection {
  id: string;
  icon: IconName;
  label: string;
  badge?: string;
}

interface AdminSidebarProps {
  sectionsList: SidebarSection[];
  activeSection: string;
  onSectionChange: (id: string) => void;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
}

export default function AdminSidebar({
  sectionsList, activeSection, onSectionChange, isOpen, onClose, userEmail,
}: AdminSidebarProps) {
  return (
    <aside className={styles.sidebar} data-open={isOpen ? "true" : "false"}>
      <div className={styles.sidebarHeader}>
        <div className={styles.sidebarBrand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/32.svg" alt="Albonnet" width={32} height={32} className={styles.brandIcon} />
          <span className={styles.brandName}>
            Al<span className={styles.brandAccent}>bonnet</span>
          </span>
        </div>
        <span className={styles.sidebarSubtitle}>Back-office</span>
      </div>

      <nav className={styles.sidebarNav}>
        {sectionsList.map((s) => (
          <SidebarItem
            key={s.id}
            icon={s.icon}
            label={s.label}
            active={activeSection === s.id}
            onClick={() => { onSectionChange(s.id); onClose(); }}
            badge={s.badge}
          />
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>AB</div>
          <div>
            <div className={styles.userName}>{userEmail || "Admin"}</div>
            <div className={styles.userRole}>Administrateur</div>
          </div>
        </div>
        <AdminButton
          variant="ghost"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          style={{ width: "100%", justifyContent: "center", fontSize: "0.8rem", padding: "8px" }}
        >
          <AdminIcon name="logout" size={14} /> Déconnexion
        </AdminButton>
      </div>
    </aside>
  );
}
