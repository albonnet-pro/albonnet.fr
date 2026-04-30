import Link from "next/link";
import styles from "./LegalPage.module.scss";
import { Icon } from "@/components/atoms";

export default function LegalPage({
  title,
  updatedAt,
  children,
}: {
  title: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link href="/" className={styles.back}>
          <Icon name="arrow-left" size={12} style={{ marginRight: "6px" }} /> Retour au site
        </Link>
      </header>
      <main className={styles.main}>
        <h1 className={styles.title}>{title}</h1>
        {updatedAt && <span className={styles.updated}>Dernière mise à jour : {updatedAt}</span>}
        <div className={styles.body}>{children}</div>
      </main>
    </div>
  );
}