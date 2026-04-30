 import { Metadata } from "next";
import LegalPage from "@/components/site/templates/LegalPage/LegalPage";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente - Alexis Bonnet",
  robots: { index: false },
};

export default function CGVPage() {
  return (
    <LegalPage title="Conditions Générales de Vente" updatedAt="avril 2026">

      <p>
        Les présentes Conditions Générales de Vente (CGV) s&apos;appliquent à toutes les prestations
        de services conclues entre <strong>Alexis Bonnet</strong>, développeur web freelance
        (ci-après « le Prestataire »), et ses clients (ci-après « le Client »).
      </p>

      <h2>1. Prestations</h2>
      <p>
        Le Prestataire propose des services de développement web : conception de sites internet,
        applications web, API, intégration, conseil technique et maintenance.
      </p>

      <h2>2. Devis et commandes</h2>
      <p>
        Toute prestation fait l&apos;objet d&apos;un devis détaillé, valable <strong>30 jours</strong>.
        La commande est confirmée à réception du devis signé et, le cas échéant, de l&apos;acompte.
      </p>

      <h2>3. Tarifs</h2>
      <p>
        Les tarifs sont exprimés en euros HT. Le Prestataire est micro-entrepreneur et bénéficie
        de la franchise de TVA (article 293 B du CGI) : <em>TVA non applicable</em>.
      </p>

      <h2>4. Modalités de paiement</h2>
      <p>Les modalités sont définies dans le devis. À titre indicatif :</p>
      <ul>
        <li>30 % d&apos;acompte à la commande</li>
        <li>Solde à la livraison</li>
      </ul>
      <p>
        En cas de retard de paiement, des pénalités de retard au taux légal en vigueur sont
        applicables, ainsi qu&apos;une indemnité forfaitaire de recouvrement de 40 €.
      </p>

      <h2>5. Délais de réalisation</h2>
      <p>
        Les délais sont précisés dans le devis et courent à compter de la réception des éléments
        nécessaires à la réalisation. Tout retard lié au Client (fourniture des contenus, validations)
        entraîne un décalage des délais.
      </p>

      <h2>6. Droits de propriété intellectuelle</h2>
      <p>
        Le transfert de propriété des livrables intervient à complet paiement. Jusqu&apos;à cette
        échéance, le Client dispose d&apos;un droit d&apos;usage non exclusif. Le Prestataire se
        réserve le droit de mentionner la réalisation dans ses références.
      </p>

      <h2>7. Responsabilité</h2>
      <p>
        La responsabilité du Prestataire est limitée au montant des sommes perçues au titre de la
        prestation concernée. Le Prestataire ne saurait être tenu responsable des dommages indirects
        (perte de chiffre d&apos;affaires, etc.).
      </p>

      <h2>8. Rétractation</h2>
      <p>
        Conformément à l&apos;article L.221-28 du Code de la consommation, le droit de rétractation
        ne s&apos;applique pas aux prestations de services pleinement exécutées avant la fin du délai
        de rétractation, avec l&apos;accord du Client.
      </p>

      <h2>9. Droit applicable - litiges</h2>
      <p>
        Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable
        sera recherchée en priorité. À défaut, les tribunaux de <strong>Grenoble</strong> seront
        seuls compétents.
      </p>

      <h2>10. Contact</h2>
      <p>
        Pour toute question : <a href="mailto:contact@albonnet.fr">contact@albonnet.fr</a>
      </p>
    </LegalPage>
  );
}