/**
 * Configurations des trois outils de démarchage.
 * Reprises TELLES QUELLES de l'objet `CFG` de chaque fichier HTML
 * (KANAE_Demarchage_*.html). Ne pas modifier les libellés : ils servent de
 * clés dans le localStorage et dans les exports CSV.
 */

/** [libellé, type] — type = "text", "choix:Option A|Option B|…" ou "choixMultiple:Option A|Option B|…" */
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
    ["Dernière plainte d'une cliente et réaction du salon", "text"],
    ["Mesure prise avant la pose pour éviter ces problèmes", "text"],
    ["Principaux problèmes avec les mèches achetées", "choixMultiple:Prix|Qualité irrégulière|Ruptures de stock|Couleurs|Allergies des clientes|Déchets|Rien"],
    ["Gérant·e (nom)", "text"],
    ["Instagram / email", "text"],
    ["Rôle de l'interlocuteur", "choix:Gérante|Coiffeuse|Apprentie"],
    ["Prestations principales", "choixMultiple:Box braids|Knotless|Twists|Crochet|Tissage|Locks"],
    ["Clientes tresses avec mèches par semaine", "text"],
    ["Paquets utilisés par pose", "choix:1 à 3|4 à 6|7 ou plus"],
    ["Marques de mèches utilisées", "text"],
    ["Réactions aux mains de l'interlocuteur", "choix:Jamais|Parfois|Souvent"],
    ["Demandes de mèches naturelles ou sans plastique", "choix:Jamais|Rarement|Souvent"],
    ["Gêne causée par les problèmes de mèches (1 à 5)", "text"],
    ["Où les mèches sont-elles achetées ?", "choixMultiple:Grossiste|Magasin afro|En ligne|La cliente les apporte"],
    ["Prix payé par paquet", "text"],
    ["Budget de mèches pour une tête complète", "choix:Moins de 15 €|15 à 30 €|30 à 50 €|Plus de 50 €"],
    ["Fin de vie des mèches après retrait", "choix:Poubelle|La cliente les garde|Réutilisées|Ne sait pas"],
    ["Intérêt pour une mèche végétale", "choix:Oui|Peut-être|Non"],
    ["Surcoût accepté par les clientes", "choix:Rien de plus|Jusqu'à 5 €|5 à 10 €|Plus de 10 €"],
    ["Bac de collecte accepté dans le salon", "choix:Oui|Peut-être|Non"],
    ["Clientes qui se plaignent de démangeaisons ?", "choix:Jamais|De temps en temps|Souvent|Presque toujours"],
    ["Vend des mèches en boutique ?", "choix:Oui|Non"],
    ["Prêt à tester des échantillons ?", "choix:Oui|Peut-être|Non"],
    ["Échantillon à tester sur une pose", "text"],
    ["Observations de la visite", "text"],
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
    ["Dernier projet avec une petite marque ou start-up", "text"],
    ["Critères d'acceptation ou de refus du projet", "choixMultiple:Quantité minimum|Budget|Faisabilité technique|Certifications|Intérêt R&D|Disponibilité"],
    ["Interlocuteur technique (nom, email direct)", "text"],
    ["Rôle de l'interlocuteur", "choix:Direction|Ingénieur ou chercheur|Commercial"],
    ["Spécialités du laboratoire", "choixMultiple:Filature ou fibres|Tests textiles|Tests dermatologiques|Cosmétique|Chimie des cellulosiques|Recyclage"],
    ["A déjà travaillé le lyocell ou le chanvre", "choix:Oui|Non|Ne sait pas"],
    ["Peut traiter lyocell pur ?", "choix:Oui|Non|À confirmer"],
    ["Peut traiter mélange lyocell/chanvre ?", "choix:Oui|Non|À confirmer"],
    ["Quantité minimale pour un prototype", "choix:Moins d'1 kg|1 à 10 kg|10 à 100 kg|Plus de 100 kg"],
    ["Délai pour un premier échantillon", "choix:Moins d'un mois|1 à 3 mois|3 à 6 mois|Plus de 6 mois"],
    ["Budget d'un prototype", "choix:Moins de 1 000 €|1 000 à 5 000 €|5 000 à 20 000 €|Plus de 20 000 €|Sur devis"],
    ["Tarif à la journée d'essai", "text"],
    ["Prestation proposée", "text"],
    ["Ce qu'une étude de faisabilité à 3 000 € permettrait", "text"],
    ["Tests réalisables", "choixMultiple:Diamètre de fibre|Résistance ou traction|Tenue à la chaleur|Tenue à la vapeur|Teinture|Tolérance cutanée|Biodégradabilité|Aucun"],
    ["Tarif annoncé", "text"],
    ["Délai annoncé", "text"],
    ["Quantité d'échantillon à fournir", "text"],
    ["Partenariat académique ou aide publique possible", "choix:Oui|Peut-être|Non"],
    ["Autres interlocuteurs recommandés", "text"],
    ["Intérêt pour le projet de mèche végétale", "choix:Oui|Peut-être|Non"],
    ["Échange technique ou devis accepté", "text"],
    ["Confidentialité / NDA demandé ?", "choix:Oui|Non"],
    ["Observations et prochaine relance", "text"],
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
    ["Derniers lots de lyocell, viscose ou chanvre reçus et devenir", "text"],
    ["Principales difficultés ou dépenses de traitement", "choixMultiple:Tri manuel|Mélanges de fibres|Manque de débouchés|Transport|Volumes trop faibles|Coût d'élimination"],
    ["Rôle de l'interlocuteur", "choix:Direction|Responsable du tri|Opérateur"],
    ["Types d'activités de la structure", "choixMultiple:Collecte|Tri|Effilochage|Économie sociale et solidaire|Entreprise privée"],
    ["Volume traité par mois", "choix:Moins de 10 tonnes|10 à 100 tonnes|100 à 500 tonnes|Plus de 500 tonnes"],
    ["Tri par composition", "choix:Oui|Partiellement|Non"],
    ["Part de fibres cellulosiques", "choix:Moins de 10 %|10 à 30 %|Plus de 30 %|Ne sait pas"],
    ["Destination de la matière effilochée", "choix:Fil|Non-tissé ou isolant|Chiffon|Ne sait pas"],
    ["Interlocuteur (nom, email direct)", "text"],
    ["Accepte un flux 100 % cellulosique ?", "choix:Oui|Non|À confirmer"],
    ["Conditions d'entrée du flux", "choixMultiple:Lavé|Trié par couleur|Sans résidus capillaires|Longueur minimale de fibre|Autre"],
    ["Lot minimum accepté (kg)", "text"],
    ["Modalité de reprise", "choix:Payante|Gratuite|Rémunérée|À étudier"],
    ["Rendement d'effilochage annoncé", "text"],
    ["Exigence d'hygiénisation avant réception", "text"],
    ["Débouché proposé", "choix:Filature|Nontissé / isolant|Autre|Ne sait pas"],
    ["Coût ou conditions de l'essai", "text"],
    ["Petit lot test ou visite du site possible", "text"],
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
