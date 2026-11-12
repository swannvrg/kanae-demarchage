import { readFile } from "node:fs/promises";
import path from "node:path";
import { connection } from "next/server";
import Papa from "papaparse";

/** Colonnes attendues dans la base de prospection. */
export const COLUMNS = [
  "ID",
  "Type",
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
  "Source",
  "À vérifier",
  "Statut démarchage",
  "Date dernier contact",
  "Prochaine action",
  "Notes",
] as const;

export type Column = (typeof COLUMNS)[number];
export type Contact = Record<Column, string>;

export type ContactsResult =
  | { ok: true; contacts: Contact[]; file: string }
  | { ok: false; error: string; file: string };

const DEFAULT_FILE = "../KANAE_base_prospection_marseille_lyocell.csv";

/** Chemin du CSV : variable KANAE_CSV_PATH (absolue ou relative à web/), sinon le fichier du dossier parent. */
export function csvPath(): string {
  return path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.KANAE_CSV_PATH || DEFAULT_FILE);
}

/**
 * Lit la base à chaque requête (connection() exclut la lecture du prérendu) :
 * un rechargement de la page reflète toute modification du CSV.
 */
export async function loadContacts(): Promise<ContactsResult> {
  await connection();
  const file = csvPath();
  let text: string;
  try {
    text = await readFile(file, "utf-8");
  } catch {
    return { ok: false, file, error: "Fichier introuvable ou illisible." };
  }

  const parsed = Papa.parse<Record<string, string>>(text.replace(/^﻿/, ""), {
    header: true,
    delimiter: ";",
    skipEmptyLines: "greedy",
    transformHeader: (h) => h.trim(),
  });

  const fields = parsed.meta.fields ?? [];
  const missing = COLUMNS.filter((c) => !fields.includes(c));
  if (missing.length) {
    return { ok: false, file, error: `Colonnes manquantes : ${missing.join(", ")}.` };
  }

  const contacts = parsed.data
    .filter((row) => row.ID?.trim())
    .map((row) => Object.fromEntries(COLUMNS.map((c) => [c, (row[c] ?? "").trim()])) as Contact);

  return { ok: true, contacts, file };
}

export function categoryOf(id: string): string {
  return id.split("-")[0]?.toUpperCase() ?? "";
}
