/**
 * Entretiens et contacts ajoutés sur le terrain — stockés dans le localStorage,
 * sous des clés SÉPARÉES du suivi existant (kanae_salons…) pour ne pas modifier
 * son format (compatible avec les fichiers HTML d'origine).
 */
import type { OutilSlug } from "./config";
import type { ContactLite } from "./suivi";
import { allQuestions, type Questionnaire, type Regle } from "./questionnaires";

export const ENTRETIENS_KEY = "kanae_entretiens";
export const AJOUTS_KEY = "kanae_contacts_ajoutes";

/** Réponse à une question. `choix` sert aux questions fermées ET aux étiquettes des questions ouvertes. */
export type Reponse = {
  choix?: string[];
  detail?: string;
  note?: string;
  valeur?: number;
  texte?: string;
};

export type Entretien = {
  contactId: string;
  cible: OutilSlug;
  debut: number;
  maj: number;
  fin?: number;
  /** Écran courant, pour reprendre un entretien interrompu. */
  etape: number;
  par: string;
  reponses: Record<string, Reponse>;
  issue?: { statut: string; relance: string; positif: boolean };
};

export type Entretiens = Record<string, Entretien>;

export type ContactAjoute = ContactLite & { ajoutePar: string; ajouteLe: number };
export type Ajouts = Record<string, ContactAjoute>;

export function hasAnswer(r: Reponse | undefined): boolean {
  if (!r) return false;
  return Boolean(r.choix?.length || r.note?.trim() || r.texte?.trim() || r.valeur || r.detail?.trim());
}

export function answeredCount(q: Questionnaire, e: Entretien | undefined): number {
  if (!e) return 0;
  return allQuestions(q).filter(({ question }) => hasAnswer(e.reponses[question.id])).length;
}

const matches = (e: Entretien, r: Regle) => (e.reponses[r.question]?.choix ?? []).some((c) => r.reponses.includes(c));

export function isPositif(q: Questionnaire, e: Entretien): boolean {
  return q.issue.positif.some((r) => matches(e, r));
}

export type Proposition = { issue: "positif" | "neutre" | "negatif"; statut: string; action: string; relance: string };

export function proposition(q: Questionnaire, e: Entretien): Proposition {
  const plus = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  if (isPositif(q, e)) {
    return { issue: "positif", statut: q.issue.statutPositif, action: q.issue.actionPositif, relance: plus(q.issue.relanceJours.positif) };
  }
  if (q.issue.negatif.length && q.issue.negatif.every((r) => matches(e, r))) {
    return { issue: "negatif", statut: q.issue.statutNegatif, action: "", relance: "" };
  }
  return { issue: "neutre", statut: q.issue.statutNeutre, action: q.issue.actionNeutre, relance: plus(q.issue.relanceJours.neutre) };
}

/** Coordonnées saisies sur une réponse « Oui (nom + téléphone…) », pour les reporter dans les notes. */
export function detailsSaisis(q: Questionnaire, e: Entretien): string[] {
  return allQuestions(q)
    .map(({ question }) => ({ question, r: e.reponses[question.id] }))
    .filter(({ r }) => r?.detail?.trim())
    .map(({ question, r }) => `${question.texte} → ${r!.choix?.join(", ") ?? ""} : ${r!.detail!.trim()}`);
}

export function nouvelId(prefix: string): string {
  // Suffixe horodaté : pas de collision entre les quatre enquêteurs à la fusion.
  return `${prefix}-T${Date.now().toString(36).toUpperCase()}`;
}
