import { Suspense } from "react";
import { categoryOf, loadContacts } from "@/lib/csv";
import { OUTILS, type OutilSlug } from "@/lib/config";
import { toLite } from "@/lib/suivi";
import { WRAP } from "@/lib/ui";
import { CsvError, Loading } from "./CsvError";
import { Outil } from "./Outil";

/** Page serveur d'un outil : en-tête statique + contacts lus dans le CSV. */
export function OutilPage({ slug }: { slug: OutilSlug }) {
  const { cfg } = OUTILS[slug];
  return (
    <div style={{ "--a": cfg.accent } as React.CSSProperties}>
      <header className="bg-(--a) py-[14px] text-white">
        <div className={WRAP}>
          <h1 className="m-0 font-serif text-[19px] font-semibold tracking-[.3px]">KANAE — {cfg.title}</h1>
          <p className="mt-1 max-w-[900px] text-[13px] opacity-90">{cfg.pitch}</p>
        </div>
      </header>
      <Suspense fallback={<Loading />}>
        <OutilData slug={slug} />
      </Suspense>
    </div>
  );
}

async function OutilData({ slug }: { slug: OutilSlug }) {
  const { prefix } = OUTILS[slug];
  const res = await loadContacts();
  if (!res.ok) return <CsvError file={res.file} error={res.error} />;
  const contacts = res.contacts.filter((c) => categoryOf(c.ID) === prefix).map(toLite);
  return <Outil slug={slug} contacts={contacts} />;
}
