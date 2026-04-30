import { Metadata } from "next";
import LegalPage from "@/components/site/templates/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Mentions légales - Alexis Bonnet",
  robots: { index: false },
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage title="Mentions légales" updatedAt="avril 2026">

      <h2>Éditeur du site</h2>
      <p>
        Le site <strong>albonnet.fr</strong> est édité par :<br />
        <strong>Alexis Bonnet</strong>, développeur web freelance<br />
        Micro-entreprise - SIRET : <strong>10367177200012</strong><br />
        Adresse : <strong>199 Impasse de Chartreuse, 38830 - Crêts en Belledonne, France</strong><br />
        Email : <a href="mailto:contact@albonnet.fr">contact@albonnet.fr</a>
      </p>

      <h2>Directeur de la publication</h2>
      <p>Alexis Bonnet</p>

      <h2>Hébergement</h2>
      <p>
        Ce site est hébergé par :<br />
        <strong>Alexis BONNET</strong><br />
        contact@albonnet.fr
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble du contenu de ce site (textes, images, graphismes, logo, code source) est la
        propriété exclusive d&apos;Alexis Bonnet, sauf mention contraire. Toute reproduction, même
        partielle, est interdite sans autorisation préalable.
      </p>

      <h2>Limitation de responsabilité</h2>
      <p>
        Les informations contenues sur ce site sont fournies à titre indicatif. Alexis Bonnet ne
        saurait être tenu responsable des erreurs ou omissions, ni des dommages directs ou indirects
        résultant de l&apos;utilisation de ce site.
      </p>

      <h2>Liens hypertextes</h2>
      <p>
        Ce site peut contenir des liens vers des sites tiers. Alexis Bonnet n&apos;exerce aucun
        contrôle sur ces sites et décline toute responsabilité quant à leur contenu.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Le présent site est soumis au droit français. En cas de litige, les tribunaux français
        seront seuls compétents.
      </p>
    </LegalPage>
  );
}