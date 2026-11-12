import Link from "next/link";
import { Suspense } from "react";
import { categoryOf, loadContacts } from "@/lib/csv";
import { CATEGORIES, OUTILS } from "@/lib/config";
import { BTN, BTN_PRIMARY, WRAP } from "@/lib/ui";
import { CsvError, Loading } from "@/components/CsvError";
import { DashboardCounters } from "@/components/DashboardCounters";

export default function Home() {
  return (
    <main className={`${WRAP} py-5`}>
      <h1 className="mb-1 font-serif text-2xl font-semibold">Tableau de bord du démarchage</h1>
      <p className="mb-5 text-sm text-mut">
        Contacts lus dans la base CSV. Le suivi (statuts, relances, entretiens) est enregistré dans ce navigateur.
      </p>
      <Suspense fallback={<Loading />}>
        <Cards />
      </Suspense>
    </main>
  );
}

async function Cards() {
  const res = await loadContacts();
  if (!res.ok) return <CsvError file={res.file} error={res.error} />;

  const byCat = new Map<string, number>();
  for (const c of res.contacts) byCat.set(categoryOf(c.ID), (byCat.get(categoryOf(c.ID)) ?? 0) + 1);

  return (
    <>
      {/* grid-rows-subgrid : en-tête, objectif, chiffres et actions alignés d'une carte à l'autre */}
      <div className="grid gap-4 md:grid-cols-3">
        {Object.values(OUTILS).map((o) => {
          const contacts = res.contacts
            .filter((c) => categoryOf(c.ID) === o.prefix)
            .map((c) => ({ ID: c.ID, Organisation: c.Organisation, Téléphone: c.Téléphone, Priorité: c.Priorité }));
          return (
            <section
              key={o.slug}
              aria-labelledby={`card-${o.slug}`}
              style={{ "--a": o.cfg.accent } as React.CSSProperties}
              className="row-span-4 grid grid-rows-subgrid gap-0 overflow-hidden rounded-lg border border-line bg-card"
            >
              <header className="bg-(--a) px-4 py-3 text-white">
                <h2 id={`card-${o.slug}`} className="m-0 font-serif text-[19px] font-semibold">
                  {o.cfg.title}
                </h2>
              </header>
              <p className="px-4 pt-3 text-[13px] text-mut">{o.cfg.pitch}</p>
              <div className="px-4 pt-3">
                <DashboardCounters contacts={contacts} slug={o.slug} />
              </div>
              <div className="px-4 pb-4 pt-3">
                <Link href={`/${o.slug}`} className={`${BTN_PRIMARY} w-full`}>
                  Ouvrir le démarchage {o.label.toLowerCase()}
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <h2 className="mb-3 mt-8 font-serif text-xl font-semibold">Autres contacts de la base</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {[
          { prefix: "MAT", color: "var(--color-matiere)", text: "Fournisseurs de chanvre cotonisé, lyocell et filatures." },
          { prefix: "FIN", color: "var(--color-financement)", text: "Subventions, prêts d'honneur, appels à projets." },
        ].map((c) => (
          <section
            key={c.prefix}
            style={{ "--a": c.color } as React.CSSProperties}
            className="flex flex-col gap-3 rounded-lg border border-line border-l-4 border-l-(--a) bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-serif text-lg font-semibold">
                {CATEGORIES[c.prefix]} <span className="text-mut">· {byCat.get(c.prefix) ?? 0} contacts</span>
              </h3>
              <p className="text-[13px] text-mut">{c.text}</p>
            </div>
            <Link href={`/contacts?type=${c.prefix}`} className={`${BTN} shrink-0`}>
              Voir les contacts {CATEGORIES[c.prefix].toLowerCase()}
            </Link>
          </section>
        ))}
      </div>

      <p className="mt-6 text-sm">
        <Link href="/contacts" className="inline-flex min-h-11 items-center">
          Voir toute la base ({res.contacts.length} contacts) →
        </Link>
      </p>
    </>
  );
}
