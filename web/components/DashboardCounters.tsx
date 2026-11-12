"use client";

import { OUTILS, type OutilSlug } from "@/lib/config";
import { computeStats } from "@/lib/suivi";
import { useSuivi } from "./useSuivi";

export function DashboardCounters({ ids, slug }: { ids: string[]; slug: OutilSlug }) {
  const cfg = OUTILS[slug].cfg;
  const s = useSuivi(cfg.key);
  const st = computeStats(s, ids, cfg);
  const items = [
    { n: st.total, label: "contacts" },
    { n: st.touched, label: "déjà contactés" },
    { n: st.win, label: "résultats positifs" },
    { n: st.due, label: "relances à faire aujourd'hui" },
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
      <div
        className="mt-3 h-1.5 rounded-[3px] bg-line"
        role="progressbar"
        aria-label="Part des contacts déjà contactés"
        aria-valuemin={0}
        aria-valuemax={st.total}
        aria-valuenow={st.touched}
      >
        <i className="block h-full rounded-[3px] bg-(--a)" style={{ width: `${st.total ? (100 * st.touched) / st.total : 0}%` }} />
      </div>
      <p className="mt-1 text-xs text-mut">Positif = {cfg.win.join(" ou ").toLowerCase()}</p>
    </div>
  );
}
