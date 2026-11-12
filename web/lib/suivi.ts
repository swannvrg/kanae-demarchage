/**
 * Suivi du démarchage, stocké dans le localStorage du navigateur.
 * Même clés (kanae_salons, kanae_labos, kanae_recyclage, kanae_me) et même
 * structure que les fichiers HTML, pour reprendre un suivi déjà commencé.
 */
import Papa from "papaparse";
import { DONE_RE, type OutilConfig } from "./config";

export type Fiche = {
  statut: string;
  date: string;
  next: string;
  nextDate: string;
  notes: string;
  par: string;
  q: Record<string, string>;
  hist: string[];
  maj: number;
};

export type Suivi = Record<string, Fiche>;

/** Champs du CSV nécessaires côté client (on n'envoie pas toute la base). */
export type ContactLite = {
  ID: string;
  "Sous-type": string;
  Organisation: string;
  Adresse: string;
  Ville: string;
  Zone: string;
  "Service / spécialité": string;
  "Contact identifié": string;
  Fonction: string;
  Téléphone: string;
  Email: string;
  "Site / formulaire": string;
  "Intérêt pour KANAE": string;
  "Accroche premier contact": string;
  "Ticket d'entrée / dispositif": string;
  "Note Google": string;
  "Nb avis": string;
  Priorité: string;
  "À vérifier": string;
};

export const ME_KEY = "kanae_me";

// ---------- Accès localStorage (repli en mémoire comme dans les HTML) ----------
const mem: Record<string, string> = {};
function getRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return mem[key] ?? null;
  }
}
function setRaw(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    mem[key] = value;
  }
}

// ---------- Petit store externe pour useSyncExternalStore ----------
const listeners = new Set<() => void>();
const cache = new Map<string, { raw: string | null; value: Suivi }>();
const EMPTY: Suivi = Object.freeze({}) as Suivi;

export function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = () => cb(); // synchro entre onglets
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}
const notify = () => listeners.forEach((l) => l());

export function readSuivi(key: string): Suivi {
  const raw = getRaw(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value: Suivi = {};
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (parsed && typeof parsed === "object") value = parsed as Suivi;
  } catch {
    value = {};
  }
  cache.set(key, { raw, value });
  return value;
}
export const serverSuivi = () => EMPTY;

export function writeSuivi(key: string, s: Suivi) {
  setRaw(key, JSON.stringify(s));
  notify();
}

export function readMe(): string {
  return getRaw(ME_KEY) ?? "";
}
export function writeMe(v: string) {
  setRaw(ME_KEY, v);
  notify();
}

// ---------- Logique métier (identique aux fichiers HTML) ----------
export function fiche(s: Suivi, id: string, cfg: OutilConfig): Fiche {
  // Données stockées éventuellement incomplètes : on complète avec les valeurs par défaut.
  const f = s[id] as Partial<Fiche> | undefined;
  return {
    statut: cfg.statuts[0],
    date: "",
    next: "",
    nextDate: "",
    notes: "",
    par: "",
    maj: 0,
    ...f,
    q: f?.q ?? {},
    hist: Array.isArray(f?.hist) ? f.hist : [],
  };
}

/** Date du jour au format AAAA-MM-JJ (fuseau local). */
export function today(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export type Stats = { total: number; touched: number; win: number; due: number };

export function computeStats(s: Suivi, ids: string[], cfg: OutilConfig): Stats {
  const all = ids.map((id) => fiche(s, id, cfg));
  const t = today();
  return {
    total: ids.length,
    touched: all.filter((f) => f.statut !== cfg.statuts[0]).length,
    win: all.filter((f) => cfg.win.includes(f.statut)).length,
    due: all.filter((f) => f.nextDate && f.nextDate <= t && !DONE_RE.test(f.statut)).length,
  };
}

// ---------- Export / import CSV (format des fichiers HTML) ----------
function headers(cfg: OutilConfig) {
  const QL = cfg.questions.map((q) => q[0]);
  return {
    QL,
    HEAD: [
      "ID",
      "Organisation",
      "Ville",
      "Téléphone",
      "Statut",
      "Dernier contact",
      "Prochaine action",
      "Date de relance",
      ...QL,
      "Notes",
      "Historique",
      "Suivi par",
      "_maj",
    ],
  };
}

const cell = (v: unknown) => '"' + String(v ?? "").replace(/"/g, '""') + '"';

export function buildExport(s: Suivi, contacts: ContactLite[], cfg: OutilConfig): string {
  const { QL, HEAD } = headers(cfg);
  const lines = [HEAD.map(cell).join(";")];
  for (const d of contacts) {
    const f = fiche(s, d.ID, cfg);
    lines.push(
      [
        d.ID,
        d.Organisation,
        d.Ville,
        d.Téléphone,
        f.statut,
        f.date,
        f.next,
        f.nextDate,
        ...QL.map((q) => f.q[q] || ""),
        f.notes,
        f.hist.join(" | "),
        f.par,
        f.maj,
      ]
        .map(cell)
        .join(";"),
    );
  }
  return "﻿" + lines.join("\r\n");
}

export type ImportResult = { ok: true; suivi: Suivi; updated: number } | { ok: false; error: string };

/** Fusion : pour chaque contact, la fiche la plus récente (_maj) l'emporte. */
export function mergeImport(text: string, s: Suivi, contacts: ContactLite[], cfg: OutilConfig): ImportResult {
  const { QL } = headers(cfg);
  const rows = Papa.parse<string[]>(text.replace(/^﻿/, ""), { delimiter: ";", skipEmptyLines: true }).data;
  const H = rows[0] ?? [];
  if (!H.includes("_maj") || !H.includes("ID")) {
    return { ok: false, error: "Ce fichier n'est pas un export de cet outil" };
  }
  const g = (row: string[], k: string) => row[H.indexOf(k)] || "";
  const known = new Set(contacts.map((c) => c.ID));
  const next: Suivi = { ...s };
  let updated = 0;
  for (const row of rows.slice(1)) {
    const id = g(row, "ID");
    const maj = Number(g(row, "_maj"));
    if (!known.has(id) || !maj) continue;
    if (maj <= fiche(next, id, cfg).maj) continue;
    next[id] = {
      statut: g(row, "Statut") || cfg.statuts[0],
      date: g(row, "Dernier contact"),
      next: g(row, "Prochaine action"),
      nextDate: g(row, "Date de relance"),
      notes: g(row, "Notes"),
      par: g(row, "Suivi par"),
      hist: g(row, "Historique") ? g(row, "Historique").split(" | ") : [],
      q: Object.fromEntries(QL.map((q) => [q, g(row, q)]).filter((x) => x[1])),
      maj,
    };
    updated++;
  }
  return { ok: true, suivi: next, updated };
}

export function toLite(c: Record<string, string>): ContactLite {
  const keys: (keyof ContactLite)[] = [
    "ID",
    "Sous-type",
    "Organisation",
    "Adresse",
    "Ville",
    "Zone",
    "Service / spécialité",
    "Contact identifié",
    "Fonction",
    "Téléphone",
    "Email",
    "Site / formulaire",
    "Intérêt pour KANAE",
    "Accroche premier contact",
    "Ticket d'entrée / dispositif",
    "Note Google",
    "Nb avis",
    "Priorité",
    "À vérifier",
  ];
  return Object.fromEntries(keys.map((k) => [k, c[k] ?? ""])) as ContactLite;
}
