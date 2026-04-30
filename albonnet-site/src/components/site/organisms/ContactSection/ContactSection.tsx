"use client";

import styles from "./ContactSection.module.scss";
import { useInView } from "@/hooks/useInView";
import { useContactForm } from "@/hooks/useContactForm";
import { SiteSettings } from "@/lib/types";
import Heading from "@/components/atoms/Heading";
import Text from "@/components/atoms/Text";
import Button from "@/components/site/atoms/Button";
import Badge from "@/components/site/atoms/Badge";
import AnimatedIn from "@/components/site/atoms/AnimatedIn";
import IconSvg from "@/components/atoms/IconSvg";
import Input from "@/components/site/atoms/Input";
import TextAreaField from "@/components/site/atoms/TextAreaField";
import { InputGroup } from "@/components/site/molecules";
import { Icon } from "@/components/atoms";

export default function ContactSection({ settings }: { settings: SiteSettings }) {
  const [ref, visible] = useInView();
  const { form, status, handleChange, handleSubmit } = useContactForm();

  return (
    <section ref={ref} id="contact" className={styles.section}>
      <div className={styles.glow} />
      <div className={styles.container}>
        <div className={styles.grid}>
          <div>
            <AnimatedIn visible={visible}>
              <Badge className={styles.contactBadge}>Contact</Badge>
            </AnimatedIn>
            <AnimatedIn visible={visible} delay={0.05}>
              <Heading level={2} className={styles.sectionHeading}>
                Un projet en tête <span className={styles.accentMark}>?</span>
              </Heading>
            </AnimatedIn>
            <AnimatedIn visible={visible} delay={0.1}>
              <Text size="1.1rem" color="var(--color-muted)" className={styles.sectionIntro}>
                Parlons de votre vision. Je vous réponds sous 24h pour discuter de la meilleure approche.
              </Text>
            </AnimatedIn>
            <AnimatedIn visible={visible} delay={0.2}>
              <div className={styles.contactItems}>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <IconSvg d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" size={20} />
                  </div>
                  <Text color="var(--color-paper)" weight={500}>{settings.email}</Text>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactIcon}>
                    <IconSvg d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" size={20} />
                  </div>
                  <Text color="var(--color-paper)" weight={500}>{settings.location}</Text>
                </div>
              </div>
            </AnimatedIn>
          </div>
          <AnimatedIn visible={visible} delay={0.15}>
            <div className={styles.formCard}>
              {status === "success" ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✓</div>
                  <Heading level={3} style={{ color: "var(--color-paper)", marginBottom: "8px" }}>
                    Message envoyé !
                  </Heading>
                  <Text color="var(--color-muted)">Je reviens vers vous très vite.</Text>
                </div>
              ) : (
                <div>
                  <InputGroup label={<span style={{ color: "var(--color-paper)" }}>Nom</span>}>
                    <Input name="name" placeholder="Votre nom" value={form.name} onChange={handleChange} className={styles.darkInput} />
                  </InputGroup>
                  <InputGroup label={<span style={{ color: "var(--color-paper)" }}>Email</span>}>
                    <Input name="email" type="email" placeholder="votre@email.com" value={form.email} onChange={handleChange} className={styles.darkInput} />
                  </InputGroup>
                  <InputGroup label={<span style={{ color: "var(--color-paper)" }}>Message</span>}>
                    <TextAreaField name="message" placeholder="Décrivez votre projet..." value={form.message} onChange={handleChange} className={styles.darkInput} />
                  </InputGroup>
                  {status === "error" && (
                    <p className={styles.errorMsg}>
                      Une erreur s&apos;est produite. Réessayez ou contactez-moi directement par email.
                    </p>
                  )}
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    style={{ width: "100%", justifyContent: "center", marginTop: "8px", opacity: status === "sending" ? 0.7 : 1 }}
                  >
                    {status === "sending" ? "Envoi en cours…" : <>Envoyer le message <Icon name="arrow-right" size={14} style={{ marginInline: "6px" }} /></>}
                  </Button>
                </div>
              )}
            </div>
          </AnimatedIn>
        </div>
      </div>
    </section>
  );
}
