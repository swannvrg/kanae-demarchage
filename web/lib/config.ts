/**
 * Configurations des trois outils de démarchage.
 * Reprises TELLES QUELLES de l'objet `CFG` de chaque fichier HTML
 * (KANAE_Demarchage_*.html). Ne pas modifier les libellés : ils servent de
 * clés dans le localStorage et dans les exports CSV.
 */

/** [libellé, type] — type = "text" ou "choix:Option A|Option B|…" */
export type Question = readonly [label: string, type: string];

export type OutilConfig = {
  key: string;
  file: string;
  title: string;
  accent: string;
  pitch: string;
  statuts: readonly string[];
  win: readonly string[];
  questions: readonly Question[];
};

export const CFG_SALONS: OutilConfig = {
  key: "kanae_salons",
  file: "KANAE_Demarchage_Salons_Afro.html",
  title: "Démarchage salons afro — Marseille",
  accent: "#5c0a3a",
  pitch:
    "Objectif : recruter 5 à 10 salons pilotes qui testent les mèches KANAE et donnent leur avis. On offre des échantillons, on ne vend rien pour l'instant.",
  statuts: [
    "À contacter",
    "Pas de réponse",
    "À rappeler",
    "Passage sur place prévu",
    "Intéressé — échantillon à envoyer",
    "Salon pilote confirmé",
    "Pas intéressé",
  ],
  win: ["Intéressé — échantillon à envoyer", "Salon pilote confirmé"],
  questions: [
    ["Gérant·e (nom)", "text"],
    ["Instagram / email", "text"],
    ["Clientes tresses avec mèches par semaine", "text"],
    ["Marques de mèches utilisées", "text"],
    ["Prix payé par paquet", "text"],
    ["Clientes qui se plaignent de démangeaisons ?", "choix:Souvent|Parfois|Rarement|Ne sait pas"],
    ["Vend des mèches en boutique ?", "choix:Oui|Non"],
    ["Prêt à tester des échantillons ?", "choix:Oui|Peut-être|Non"],
  ],
};

export const CFG_LABOS: OutilConfig = {
  key: "kanae_labos",
  file: "KANAE_Demarchage_Labos.html",
  title: "Démarchage labos et centres techniques",
  accent: "#1f4e5f",
  pitch:
    "Objectif : obtenir un interlocuteur technique, puis un devis pour des essais sur mèche en lyocell texturé et en mélange lyocell/chanvre. Budget faisabilité : 3 000 €.",
  statuts: [
    "À contacter",
    "Email envoyé",
    "Relance à faire",
    "Échange en cours",
    "RDV / visio planifié",
    "Devis demandé",
    "Devis reçu",
    "Partenaire retenu",
    "Écarté",
  ],
  win: ["Devis reçu", "Partenaire retenu"],
  questions: [
    ["Interlocuteur technique (nom, email direct)", "text"],
    ["Peut traiter lyocell pur ?", "choix:Oui|Non|À confirmer"],
    ["Peut traiter mélange lyocell/chanvre ?", "choix:Oui|Non|À confirmer"],
    ["Prestation proposée", "text"],
    ["Tarif annoncé", "text"],
    ["Délai annoncé", "text"],
    ["Quantité d'échantillon à fournir", "text"],
    ["Confidentialité / NDA demandé ?", "choix:Oui|Non"],
  ],
};

export const CFG_RECYCLAGE: OutilConfig = {
  key: "kanae_recyclage",
  file: "KANAE_Demarchage_Recyclage.html",
  title: "Démarchage centres de recyclage textile",
  accent: "#3d5a2a",
  pitch:
    "Objectif : savoir qui accepterait un flux de mèches usagées 100 % cellulosiques (lyocell ou lyocell/chanvre), à quelles conditions, et obtenir un essai sur petit lot.",
  statuts: [
    "À contacter",
    "Email envoyé",
    "Relance à faire",
    "Échange en cours",
    "Essai sur lot accepté",
    "Partenaire retenu",
    "Écarté",
  ],
  win: ["Essai sur lot accepté", "Partenaire retenu"],
  questions: [
    ["Interlocuteur (nom, email direct)", "text"],
    ["Accepte un flux 100 % cellulosique ?", "choix:Oui|Non|À confirmer"],
    ["Lot minimum accepté (kg)", "text"],
    ["Rendement d'effilochage annoncé", "text"],
    ["Exigence d'hygiénisation avant réception", "text"],
    ["Débouché proposé", "choix:Filature|Nontissé / isolant|Autre|Ne sait pas"],
    ["Coût ou conditions de l'essai", "text"],
    ["Intéressé par un dossier Refashion commun ?", "choix:Oui|Non|À voir"],
  ],
};

export type OutilSlug = "salons" | "labos" | "recyclage";

/** Lien entre une page, un préfixe d'ID dans le CSV et une configuration. */
export const OUTILS: Record<OutilSlug, { slug: OutilSlug; prefix: string; label: string; cfg: OutilConfig }> = {
  salons: { slug: "salons", prefix: "SAL", label: "Salons afro", cfg: CFG_SALONS },
  labos: { slug: "labos", prefix: "LAB", label: "Labos", cfg: CFG_LABOS },
  recyclage: { slug: "recyclage", prefix: "REC", label: "Recyclage", cfg: CFG_RECYCLAGE },
};

/** Catégories de la base, déduites du préfixe de l'ID. */
export const CATEGORIES: Record<string, string> = {
  SAL: "Salons afro",
  LAB: "Labos / centres techniques",
  REC: "Recyclage textile",
  MAT: "Matière première",
  FIN: "Financement",
};

/** Statuts considérés comme terminés (même règle que les fichiers HTML). */
export const DONE_RE = /Pas intéressé|Écarté/;
