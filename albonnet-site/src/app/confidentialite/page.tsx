import { Metadata } from "next";
import LegalPage from "@/components/site/templates/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Politique de confidentialité - Alexis Bonnet",
  robots: { index: false },
};

export default function ConfidentialitePage() {
  return (
    <LegalPage title="Politique de confidentialité" updatedAt="avril 2026">

      <p>
        La présente politique décrit comment le site <strong>albonnet.fr</strong> traite les
        données dans le cadre de son utilisation, conformément au Règlement Général sur la
        Protection des Données (RGPD).
      </p>

      <h2>Responsable du traitement</h2>
      <p>
        <strong>Alexis Bonnet</strong> - <a href="mailto:contact@albonnet.fr">contact@albonnet.fr</a>
      </p>

      <h2>Données collectées</h2>
      <p>
        Ce site <strong>ne stocke aucune donnée personnelle des visiteurs</strong>.
      </p>
      <p>
        Le formulaire de contact collecte temporairement un nom, une adresse e-mail et un message
        dans le seul but d&apos;acheminer votre demande par e-mail. Ces données <strong>ne sont
        jamais enregistrées en base de données </strong> et ne sont ni conservées, ni revendues,
        ni transmises à des tiers, à l&apos;exception du service d&apos;envoi décrit ci-dessous.
      </p>

      <h2>Service d&apos;envoi d&apos;e-mails</h2>
      <p>
        Les messages envoyés via le formulaire de contact transitent par{" "}
        <strong>Resend</strong> (<a href="https://resend.com" target="_blank" rel="noopener noreferrer">resend.com</a>),
        un service tiers d&apos;envoi d&apos;e-mails. Vos données passent par leurs serveurs le
        temps de la transmission, sans stockage de notre côté.
      </p>

      <h2>Cookies et tracking</h2>
      <p>
        Ce site <strong>n&apos;utilise aucun cookie </strong> de tracking, d&apos;analyse ou
        publicitaire. Aucun outil de mesure d&apos;audience n&apos;est installé.
      </p>

      <h2>Vos droits</h2>
      <p>
        Conformément au RGPD, vous pouvez exercer vos droits d&apos;accès, de rectification et
        d&apos;effacement en contactant :{" "}
        <a href="mailto:contact@albonnet.fr">contact@albonnet.fr</a>
      </p>
      <p>
        En cas de réclamation, vous pouvez contacter la{" "}
        <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">CNIL</a>.
      </p>
    </LegalPage>
  );
}