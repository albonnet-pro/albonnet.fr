import { ReactNode, CSSProperties } from "react";
import styles from "./CardEditor.module.scss";
import AdminButton from "@/components/admin/atoms/AdminButton";
import AdminIcon from "@/components/admin/atoms/AdminIcon";

export default function CardEditor({ children, title, onDelete, style }: {
  children: ReactNode;
  title?: string;
  onDelete?: () => void;
  style?: CSSProperties;
}) {
  return (
    <div className={styles.card} style={style}>
      {title && (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          {onDelete && (
            <AdminButton
              variant="danger"
              onClick={onDelete}
              style={{ padding: "6px 12px", fontSize: "0.78rem" }}
            >
              <AdminIcon name="trash" size={14} /> Supprimer
            </AdminButton>
          )}
        </div>
      )}
      {children}
    </div>
  );
}