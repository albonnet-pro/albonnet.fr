import styles from "./Toast.module.scss";
import AdminIcon from "@/components/admin/atoms/AdminIcon";

const COLORS: Record<string, string> = {
  success: "#34d399",
  error: "#f87171",
  warning: "#fbbf24",
};

export default function Toast({ message, visible, type = "success" }: {
  message: string;
  visible: boolean;
  type?: string;
}) {
  const color = COLORS[type] || COLORS.success;
  return (
    <div
      className={styles.toast}
      data-visible={visible ? "true" : "false"}
      style={{ color, borderColor: `${color}40` }}
    >
      <AdminIcon name="check" size={18} />
      {message}
    </div>
  );
}