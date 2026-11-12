"use client";

import { OUTILS, type OutilSlug } from "@/lib/config";
import { computeStats } from "@/lib/suivi";
import { useSuivi } from "./useSuivi";

type MiniContact = { ID: string; Organisation: string; Téléphone: string; Priorité: string };

export function DashboardCounters({ contacts, slug }: { contacts: MiniContact[]; slug: OutilSlug }) {
  const cfg = OUTILS[slug].cfg;
  const s = useSuivi(cfg.key);
  const ids = contacts.map((c) => c.ID);
  const st = computeStats(s, ids, cfg);
  const pct = st.total ? Math.round((100 * st.touched) / st.total) : 0;
  const items = [
    { n: st.total, label: "contacts" },
    { n: st.touched, label: "déjà contactés" },
    { n: st.win, label: "résultats positifs" },
    { n: st.due, label: "relances aujourd'hui" },
  ];
  return (
    <div>
      <dl className="grid grid-cols-2 gap-2">
        {items.map((i) => (
          <div key={i.label} className="rounded-md bg-soft px-3 py-2">
            <dt className="text-xs text-mut">{i.label}</dt>
            <dd className="m-0 text-xl font-semibold">{i.n}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-3 flex items-baseline justify-between text-xs text-mut">
        <span id={`prog-${slug}`}>
          <b className="text-ink">{st.touched}</b> contactés sur {st.total}
        </span>
        <span>{pct} %</span>
      </div>
      <div
        className="mt-1 h-2 rounded-full bg-line"
        role="progressbar"
        aria-labelledby={`prog-${slug}`}
        aria-valuemin={0}
        aria-valuemax={st.total}
        aria-valuenow={st.touched}
      >
        <i className="block h-full rounded-full bg-(--a)" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-2 text-xs text-mut">
        {st.due === 0 ? "Aucune relance prévue aujourd'hui." : `${st.due} relance${st.due > 1 ? "s" : ""} à faire aujourd'hui.`}{" "}
        Positif = {cfg.win.join(" ou ").toLowerCase()}.
      </p>
    </div>
  );
}
