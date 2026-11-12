import Link from "next/link";
import { Suspense } from "react";
import { categoryOf, loadContacts } from "@/lib/csv";
import { CATEGORIES, OUTILS } from "@/lib/config";
import { CsvError, Loading } from "@/components/CsvError";
import { DashboardCounters } from "@/components/DashboardCounters";

export default function Home() {
  return (
    <main className="px-[18px] py-[14px]">
      <h1 className="mb-1 font-serif text-2xl font-semibold">Tableau de bord du démarchage</h1>
      <p className="mb-4 text-sm text-mut">
        Contacts lus dans la base CSV. Le suivi (statuts, relances) est enregistré dans ce navigateur.
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

  const byCat = new Map<string, string[]>();
  for (const c of res.contacts) {
    const cat = categoryOf(c.ID);
    byCat.set(cat, [...(byCat.get(cat) ?? []), c.ID]);
  }

  return (
    <>
      <div className="grid gap-[14px] md:grid-cols-3">
        {Object.values(OUTILS).map((o) => {
          const ids = byCat.get(o.prefix) ?? [];
          return (
            <section
              key={o.slug}
              style={{ "--a": o.cfg.accent } as React.CSSProperties}
              className="flex flex-col overflow-hidden rounded-lg border border-line bg-card"
            >
              <header className="bg-(--a) px-4 py-3 text-white">
                <h2 className="m-0 font-serif text-[19px] font-semibold">{o.cfg.title}</h2>
              </header>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <p className="text-[13px] text-mut">{o.cfg.pitch}</p>
                <DashboardCounters ids={ids} slug={o.slug} />
                <Link
                  href={`/${o.slug}`}
                  className="mt-auto inline-block rounded-md border border-(--a) bg-(--a) px-3 py-2 text-center text-white no-underline"
                >
                  Ouvrir l&apos;outil {o.label.toLowerCase()}
                </Link>
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-[14px] rounded-lg border border-line bg-card p-4">
        <h2 className="font-serif text-lg font-semibold">Toute la base</h2>
        <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mut">
          {Object.entries(CATEGORIES).map(([prefix, label]) => (
            <li key={prefix}>
              <b className="text-base text-ink">{byCat.get(prefix)?.length ?? 0}</b> {label}
            </li>
          ))}
        </ul>
        <Link href="/contacts" className="mt-3 inline-block text-sm">
          Voir les {res.contacts.length} contacts →
        </Link>
      </section>
    </>
  );
}
