import type { Metadata } from "next";
import { Suspense } from "react";
import { categoryOf, loadContacts, type Contact } from "@/lib/csv";
import { CATEGORIES } from "@/lib/config";
import { CsvError, Loading } from "@/components/CsvError";
import { WRAP } from "@/lib/ui";

export const metadata: Metadata = { title: "Toute la base" };

type Search = { q?: string | string[]; type?: string | string[] };

/**
 * Tableau en lecture seule de toute la base. Recherche et filtre passent par
 * l'URL (formulaire GET) : la page reste un composant serveur, sans JavaScript.
 */
export default function ContactsPage({ searchParams }: { searchParams: Promise<Search> }) {
  return (
    <main className={`${WRAP} py-5`}>
      <h1 className="mb-3 font-serif text-2xl font-semibold">Toute la base de prospection</h1>
      <Suspense fallback={<Loading />}>
        <ContactsTable searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

const first = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

const COLS: { key: keyof Contact; label: string }[] = [
  { key: "ID", label: "ID" },
  { key: "Organisation", label: "Organisation" },
  { key: "Sous-type", label: "Sous-type" },
  { key: "Ville", label: "Ville" },
  { key: "Contact identifié", label: "Contact" },
  { key: "Téléphone", label: "Téléphone" },
  { key: "Email", label: "Email" },
  { key: "Priorité", label: "Prio." },
  { key: "À vérifier", label: "À vérifier" },
];

async function ContactsTable({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const q = first(sp.q).trim();
  const type = first(sp.type).toUpperCase();

  const res = await loadContacts();
  if (!res.ok) return <CsvError file={res.file} error={res.error} />;

  const needle = q.toLowerCase();
  const rows = res.contacts.filter(
    (c) =>
      (!type || categoryOf(c.ID) === type) &&
      (!needle || Object.values(c).join(" ").toLowerCase().includes(needle)),
  );

  const counts = new Map<string, number>();
  for (const c of res.contacts) counts.set(categoryOf(c.ID), (counts.get(categoryOf(c.ID)) ?? 0) + 1);

  const ctrl = "min-h-11 rounded-md border border-line bg-white px-3 py-2 text-ink [font:inherit]";

  return (
    <>
      <form method="get" className="no-print mb-3 flex flex-wrap items-center gap-2 rounded-md bg-soft p-[10px]">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Rechercher dans toute la base…"
          aria-label="Rechercher"
          className={`${ctrl} min-w-[180px] flex-1`}
        />
        <select name="type" defaultValue={type} aria-label="Filtrer par type" className={ctrl}>
          <option value="">Tous types ({res.contacts.length})</option>
          {Object.entries(CATEGORIES).map(([prefix, label]) => (
            <option key={prefix} value={prefix}>
              {label} ({counts.get(prefix) ?? 0})
            </option>
          ))}
        </select>
        <button type="submit" className={`${ctrl} cursor-pointer border-ink bg-ink text-white`}>
          Filtrer
        </button>
        {(q || type) && (
          <a href="/contacts" className="inline-flex min-h-11 items-center text-sm">
            Réinitialiser
          </a>
        )}
      </form>

      <p className="mb-2 text-[13px] text-mut" aria-live="polite">
        {rows.length} contact{rows.length > 1 ? "s" : ""} affiché{rows.length > 1 ? "s" : ""}
      </p>

      <div className="overflow-x-auto rounded-lg border border-line bg-card">
        <table className="w-full min-w-[900px] border-collapse text-[13px]">
          <caption className="sr-only">Contacts de la base de prospection KANAE</caption>
          <thead>
            <tr className="bg-soft text-left">
              {COLS.map((c) => (
                <th key={c.key} scope="col" className="border-b border-line px-3 py-2 font-semibold">
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr key={c.ID} className="align-top odd:bg-white even:bg-bg">
                {COLS.map((col) => {
                  const v = c[col.key];
                  let content: React.ReactNode = v;
                  if (col.key === "Organisation") {
                    content = (
                      <>
                        <span className="font-semibold">{v}</span>
                        <span className="block text-mut">{c.Type}</span>
                      </>
                    );
                  } else if (col.key === "Téléphone" && /\d{2}/.test(v)) {
                    content = <a href={`tel:${v.replace(/[^\d+]/g, "")}`}>{v}</a>;
                  } else if (col.key === "Email" && /@/.test(v) && !/ /.test(v.trim())) {
                    content = <a href={`mailto:${v}`}>{v}</a>;
                  }
                  return (
                    <td key={col.key} className="border-b border-line px-3 py-2 break-words">
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={COLS.length} className="p-[30px] text-center text-mut">
                  Aucun contact pour cette recherche.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
