/**
 * QUESTIONNAIRES KANAE — fichier unique, modifiable sans toucher aux composants.
 *
 * Types de questions :
 *   "ouverte"  : notes libres + étiquettes cliquables (choix multiples), relance en texte discret
 *   "unique"   : gros boutons, un seul appui
 *   "multiple" : gros boutons, plusieurs choix
 *   "echelle"  : note de min à max
 *   "texte"    : texte libre
 * Une option { label, detail } affiche un champ (ex. nom + téléphone) quand elle est choisie.
 *
 * ⚠ Les `id` servent de clés aux réponses enregistrées : ne pas les changer une fois des
 * entretiens saisis (on peut librement modifier les textes et ajouter des questions).
 */
import type { OutilSlug } from "./config";

export type Option = string | { label: string; detail: string };

export type Question =
  | { id: string; type: "ouverte"; texte: string; etiquettes: string[]; relance?: string }
  | { id: string; type: "unique"; texte: string; options: Option[] }
  | { id: string; type: "multiple"; texte: string; options: Option[] }
  | { id: string; type: "echelle"; texte: string; min: number; max: number; libelleMin: string; libelleMax: string }
  | { id: string; type: "texte"; texte: string; aide?: string };

export type Section = {
  titre: string;
  /** Texte à lire avant les questions de la section (présentation du produit). */
  presentation?: string;
  questions: Question[];
};

/** Règle : la réponse à `question` contient l'une des `reponses`. */
export type Regle = { question: string; reponses: string[] };

export type Questionnaire = {
  cible: OutilSlug;
  titre: string;
  dureeCible: string;
  but: string;
  accroche: string;
  sections: Section[];
  /** Mise à jour du statut du contact en fin d'entretien. */
  issue: {
    /** Positif si AU MOINS une règle est vraie. */
    positif: Regle[];
    /** Négatif si TOUTES les règles sont vraies. */
    negatif: Regle[];
    statutPositif: string;
    statutNeutre: string;
    statutNegatif: string;
    actionPositif: string;
    actionNeutre: string;
    /** Délai proposé pour la relance, en jours. */
    relanceJours: { positif: number; neutre: number };
  };
};

export const optionLabel = (o: Option) => (typeof o === "string" ? o : o.label);
export const optionDetail = (o: Option) => (typeof o === "string" ? undefined : o.detail);

// ---------------------------------------------------------------------------
// 1. SALONS AFRO (Marseille)
// ---------------------------------------------------------------------------
const SALONS: Questionnaire = {
  cible: "salons",
  titre: "Salons afro (Marseille)",
  dureeCible: "3 à 4 min",
  but: "Vérifier que les mèches synthétiques posent un vrai problème aux coiffeuses et aux clientes, mesurer le budget réel, tester l'intérêt pour une mèche végétale et pour la collecte en salon.",
  accroche:
    "Bonjour, je suis étudiant et je fais une étude sur les mèches utilisées dans les salons de tresses à Marseille. J'ai 3 minutes de questions, je ne vends rien.",
  sections: [
    {
      titre: "Ouverture",
      questions: [
        {
          id: "sal_plainte",
          type: "ouverte",
          texte:
            "La dernière fois qu'une cliente s'est plainte de ses tresses après la pose, c'était pour quoi ? Vous avez fait comment ?",
          etiquettes: [
            "Démangeaisons",
            "Irritation ou boutons",
            "Odeur de plastique",
            "Trop lourd",
            "Trop chaud",
            "Ça glisse ou se défait",
            "Aucune plainte",
          ],
          relance: "Vous faites quelque chose avant la pose pour éviter ça ? (ex. rinçage au vinaigre)",
        },
        {
          id: "sal_probleme",
          type: "ouverte",
          texte: "Qu'est-ce qui vous pose le plus de problèmes avec les mèches que vous achetez ?",
          etiquettes: ["Prix", "Qualité irrégulière", "Ruptures de stock", "Couleurs", "Allergies des clientes", "Déchets", "Rien"],
        },
      ],
    },
    {
      titre: "Le salon",
      questions: [
        { id: "sal_interlocuteur", type: "unique", texte: "Interlocuteur", options: ["Gérante", "Coiffeuse", "Apprentie"] },
        {
          id: "sal_prestations",
          type: "multiple",
          texte: "Prestations principales",
          options: ["Box braids", "Knotless", "Twists", "Crochet", "Tissage", "Locks"],
        },
        {
          id: "sal_poses",
          type: "unique",
          texte: "Poses avec mèches par semaine",
          options: ["Moins de 5", "5 à 15", "16 à 30", "Plus de 30"],
        },
      ],
    },
    {
      titre: "Le problème mesuré",
      questions: [
        { id: "sal_paquets", type: "unique", texte: "Paquets utilisés par pose", options: ["1 à 3", "4 à 6", "7 ou plus"] },
        {
          id: "sal_demangeaisons",
          type: "unique",
          texte: "Clientes qui se plaignent de démangeaisons",
          options: ["Jamais", "De temps en temps", "Souvent", "Presque toujours"],
        },
        {
          id: "sal_mains",
          type: "unique",
          texte: "Vous-même, avez-vous des réactions aux mains à cause des mèches ?",
          options: ["Jamais", "Parfois", "Souvent"],
        },
        {
          id: "sal_demande_naturel",
          type: "unique",
          texte: "Clientes qui demandent des mèches naturelles ou sans plastique",
          options: ["Jamais", "Rarement", "Souvent"],
        },
        {
          id: "sal_gene",
          type: "echelle",
          texte: "Gêne causée par les problèmes de mèches",
          min: 1,
          max: 5,
          libelleMin: "Pas gênant",
          libelleMax: "Très gênant",
        },
      ],
    },
    {
      titre: "L'existant",
      questions: [
        { id: "sal_marque", type: "texte", texte: "Marque utilisée" },
        {
          id: "sal_achat",
          type: "multiple",
          texte: "Où achetez-vous les mèches ?",
          options: ["Grossiste", "Magasin afro", "En ligne", "La cliente les apporte"],
        },
        {
          id: "sal_prix_paquet",
          type: "unique",
          texte: "Prix par paquet",
          options: ["Moins de 3 €", "3 à 5 €", "5 à 8 €", "Plus de 8 €"],
        },
        {
          id: "sal_prix_tete",
          type: "unique",
          texte: "Combien une cliente paie-t-elle ses mèches pour une tête complète ?",
          options: ["Moins de 15 €", "15 à 30 €", "30 à 50 €", "Plus de 50 €"],
        },
        {
          id: "sal_fin_vie",
          type: "unique",
          texte: "Que deviennent les mèches quand une cliente se détresse ici ?",
          options: ["Poubelle", "La cliente les garde", "Réutilisées", "Ne sait pas"],
        },
      ],
    },
    {
      titre: "Le produit",
      presentation:
        "Je travaille sur des mèches en fibre végétale, à base de lyocell et de chanvre, pensées pour ne pas gratter, et qu'on reprend après usage pour les recycler en textile.",
      questions: [
        { id: "sal_interet", type: "unique", texte: "Ça vous intéresserait ?", options: ["Non", "Peut-être", "Oui"] },
        {
          id: "sal_prix_accepte",
          type: "unique",
          texte: "Pour une tête complète, vos clientes accepteraient de payer combien en plus ?",
          options: ["Rien de plus", "Jusqu'à 5 €", "5 à 10 €", "Plus de 10 €"],
        },
        {
          id: "sal_collecte",
          type: "unique",
          texte: "Accepteriez-vous un bac de collecte des mèches usagées dans le salon ?",
          options: ["Non", "Peut-être", "Oui"],
        },
        {
          id: "sal_echantillon",
          type: "unique",
          texte: "Je peux revenir avec un échantillon à tester sur une pose ?",
          options: [{ label: "Oui", detail: "Prénom + téléphone ou Instagram" }, "Non"],
        },
      ],
    },
    {
      titre: "Ton observation",
      questions: [
        {
          id: "sal_observation",
          type: "texte",
          texte: "Ce que tu as vu pendant la visite",
          aide: "Poses en cours, stock de mèches visible, marques vues au mur.",
        },
      ],
    },
  ],
  issue: {
    positif: [{ question: "sal_echantillon", reponses: ["Oui"] }],
    negatif: [
      { question: "sal_interet", reponses: ["Non"] },
      { question: "sal_echantillon", reponses: ["Non"] },
    ],
    statutPositif: "Intéressé — échantillon à envoyer",
    statutNeutre: "À rappeler",
    statutNegatif: "Pas intéressé",
    actionPositif: "Revenir avec un échantillon",
    actionNeutre: "Rappeler le salon",
    relanceJours: { positif: 3, neutre: 7 },
  },
};

export const QUESTIONNAIRES: Partial<Record<OutilSlug, Questionnaire>> = {
  salons: SALONS,
};

/** Toutes les questions d'un questionnaire, dans l'ordre. */
export function allQuestions(q: Questionnaire): { section: Section; question: Question }[] {
  return q.sections.flatMap((section) => section.questions.map((question) => ({ section, question })));
}
