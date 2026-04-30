"use client";

import styles from "./SidebarItem.module.scss";
import AdminIcon from "@/components/admin/atoms/AdminIcon";
import AdminBadge from "@/components/admin/atoms/AdminBadge";
import {Icon} from "@/components/atoms";
import {IconName} from "@fortawesome/fontawesome-svg-core";

export default function SidebarItem({ icon, label, active, onClick, badge }: {
  icon: IconName;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: string;
}) {
  return (
    <button
      onClick={onClick}
      data-active={active ? "true" : "false"}
      className={styles.item}
    >
      <Icon name={icon} size={18} />
      <span className={styles.label}>{label}</span>
      {badge && <AdminBadge>{badge}</AdminBadge>}
    </button>
  );
}