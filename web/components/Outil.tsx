"use client";

import { useMemo, useRef, useState } from "react";
import { DONE_RE, OUTILS, type OutilSlug } from "@/lib/config";
import {
  buildExport,
  computeStats,
  fiche,
  mergeImport,
  today,
  writeMe,
  writeSuivi,
  type ContactLite,
  type Fiche,
} from "@/lib/suivi";
import { useMe, useSuivi } from "./useSuivi";
import { WRAP } from "@/lib/ui";

const ctrl =
  "min-h-11 rounded-md border border-line bg-white px-3 py-2 text-ink [font:inherit] focus:border-(--a) focus:outline-none";

export function Outil({ slug, contacts }: { slug: OutilSlug; contacts: ContactLite[] }) {
  const cfg = OUTILS[slug].cfg;
  const S = useSuivi(cfg.key);
  const me = useMe();
  const [cur, setCur] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [fs, setFs] = useState("");
  const [fp, setFp] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const fileRef = useRef<HTMLInputElement>(null);
  const detRef = useRef<HTMLDivElement>(null);

  const toast = (t: string) => {
    setToastMsg(t);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 1800);
  };

  const ids = useMemo(() => contacts.map((c) => c.ID), [contacts]);
  const stats = computeStats(S, ids, cfg);

  const list = contacts.filter((d) => {
    const s = fiche(S, d.ID, cfg);
    if (fs && s.statut !== fs) return false;
    if (fp && (fp === "3" ? Number(d.Priorité) < 3 : d.Priorité !== fp)) return false;
    const hay = `${d.Organisation} ${d.Adresse} ${d.Ville} ${d.Zone} ${d["Sous-type"]}`.toLowerCase();
    return !q || hay.includes(q.toLowerCase());
  });

  /** Même règle que les fichiers HTML : historique au changement de statut, date auto, _maj. */
  function update(id: string, patch: (f: Fiche) => Partial<Fiche>) {
    const f = fiche(S, id, cfg);
    const name = me.trim();
    writeSuivi(cfg.key, { ...S, [id]: { ...f, ...patch(f), par: name || f.par, maj: Date.now() } });
  }

  function setField(id: string, k: "statut" | "date" | "next" | "nextDate" | "notes", v: string) {
    update(id, (f) => {
      const p: Partial<Fiche> = { [k]: v };
      if (k === "statut" && f.statut !== v) {
        const name = me.trim();
        p.hist = [...f.hist, `${new Date().toLocaleDateString("fr-FR")} — ${v}${name ? ` (${name})` : ""}`];
        if (!f.date) p.date = today();
      }
      return p;
    });
  }

  function exportCsv() {
    const blob = new Blob([buildExport(S, contacts, cfg)], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${cfg.key}_suivi_${today()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    toast("Suivi exporté");
  }

  function importCsv(file: File) {
    const rd = new FileReader();
    rd.onload = () => {
      const res = mergeImport(String(rd.result ?? ""), S, contacts, cfg);
      if (!res.ok) return toast(res.error);
      writeSuivi(cfg.key, res.suivi);
      toast(`${res.updated} fiche(s) mise(s) à jour`);
    };
    rd.readAsText(file, "utf-8");
  }

  function select(id: string) {
    setCur(id);
    // Sur petit écran, la fiche est sous la liste : on y descend.
    if (window.matchMedia("(max-width: 760px)").matches) {
      requestAnimationFrame(() => detRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const d = contacts.find((c) => c.ID === cur);

  return (
    <div className={WRAP}>
      <div className="no-print -mx-4 flex flex-wrap items-center gap-2 border-b border-line bg-soft px-4 py-[10px] sm:mx-0 sm:mt-3 sm:rounded-md sm:border">
        <input
          className={`${ctrl} w-full sm:w-[140px]`}
          placeholder="Ton prénom"
          aria-label="Ton prénom"
          value={me}
          onChange={(e) => writeMe(e.target.value)}
        />
        <input
          type="search"
          className={`${ctrl} min-w-[160px] flex-1`}
          placeholder="Rechercher un nom, une rue, une ville…"
          aria-label="Rechercher"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select className={ctrl} aria-label="Filtrer par statut" value={fs} onChange={(e) => setFs(e.target.value)}>
          <option value="">Tous statuts</option>
          {cfg.statuts.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select className={ctrl} aria-label="Filtrer par priorité" value={fp} onChange={(e) => setFp(e.target.value)}>
          <option value="">Toutes priorités</option>
          <option value="1">Priorité 1</option>
          <option value="2">Priorité 2</option>
          <option value="3">Priorité 3 et plus</option>
        </select>
        <button type="button" className={`${ctrl} cursor-pointer border-(--a) bg-(--a) text-white`} onClick={exportCsv}>
          Exporter le suivi (CSV)
        </button>
        <button type="button" className={`${ctrl} cursor-pointer`} onClick={() => fileRef.current?.click()}>
          Importer le suivi d&apos;un collègue
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          hidden
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) importCsv(f);
            e.target.value = "";
          }}
        />
      </div>

      <div className="flex flex-wrap gap-x-[14px] gap-y-1 py-[10px] text-[13px] text-mut" aria-live="polite">
        <span>
          <b className="text-base text-ink">{stats.total}</b> contacts
        </span>
        <span>
          <b className="text-base text-ink">{stats.touched}</b> déjà contactés
        </span>
        <span>
          <b className="text-base text-ink">{stats.win}</b> {cfg.win[0].toLowerCase()} ou mieux
        </span>
        <span>
          <b className="text-base text-ink">{stats.due}</b> relances à faire aujourd&apos;hui
        </span>
      </div>
      <div className="flex items-baseline justify-between text-xs text-mut">
        <span id="prog-outil">
          <b className="text-ink">{stats.touched}</b> contactés sur {stats.total}
        </span>
        <span>{stats.total ? Math.round((100 * stats.touched) / stats.total) : 0} %</span>
      </div>
      <div
        className="mt-1 h-2 rounded-full bg-line"
        role="progressbar"
        aria-labelledby="prog-outil"
        aria-valuemin={0}
        aria-valuemax={stats.total}
        aria-valuenow={stats.touched}
      >
        <i
          className="block h-full rounded-full bg-(--a) transition-[width]"
          style={{ width: `${stats.total ? (100 * stats.touched) / stats.total : 0}%` }}
        />
      </div>

      <main className="grid items-start gap-[14px] py-[14px] min-[761px]:grid-cols-[minmax(280px,380px)_1fr]">
        <div
          className="no-print flex flex-col gap-1.5 min-[761px]:max-h-[calc(100vh-230px)] min-[761px]:overflow-auto"
          aria-label="Liste des contacts"
          role="list"
        >
          {list.length === 0 && <div className="p-[30px] text-center text-mut">Aucun contact pour ce filtre.</div>}
          {list.map((c) => {
            const s = fiche(S, c.ID, cfg);
            const win = cfg.win.includes(s.statut);
            const done = DONE_RE.test(s.statut);
            const on = c.ID === cur;
            return (
              <button
                key={c.ID}
                type="button"
                role="listitem"
                aria-current={on ? "true" : undefined}
                onClick={() => select(c.ID)}
                className={`min-h-14 w-full cursor-pointer rounded-md border border-l-4 bg-card px-3 py-2.5 text-left ${
                  on ? "border-(--a) shadow-[0_1px_4px_#0002]" : "border-line"
                } ${win ? "border-l-win" : on ? "border-l-(--a)" : "border-l-line"} ${done ? "opacity-60" : ""}`}
              >
                <div className="font-semibold">{c.Organisation}</div>
                <div className="flex justify-between gap-2 text-xs text-mut">
                  <span>{c.Zone || c.Ville}</span>
                  <span
                    className={`whitespace-nowrap rounded-[10px] px-[7px] py-px text-[11px] ${
                      c.Priorité === "1" ? "bg-(--a) text-white" : "bg-soft text-mut"
                    }`}
                  >
                    P{c.Priorité}
                  </span>
                </div>
                <div className="flex justify-between gap-2 text-xs text-mut">
                  <span>{s.statut}</span>
                  <span>{s.nextDate ? `↻ ${s.nextDate}` : ""}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div ref={detRef} className="scroll-mt-2 rounded-lg border border-line bg-card px-[18px] py-4">
          {d ? (
            <Detail
              d={d}
              f={fiche(S, d.ID, cfg)}
              slug={slug}
              onField={(k, v) => setField(d.ID, k, v)}
              onQuestion={(label, v) => update(d.ID, (f) => ({ q: { ...f.q, [label]: v } }))}
              toast={toast}
            />
          ) : (
            <div className="p-[30px] text-center text-mut">Choisis un contact dans la liste.</div>
          )}
        </div>
      </main>

      <div
        role="status"
        className={`pointer-events-none fixed bottom-4 left-1/2 -translate-x-1/2 rounded-md bg-[#222] px-[14px] py-2 text-[13px] text-white transition-opacity duration-200 ${
          toastMsg ? "opacity-100" : "opacity-0"
        }`}
      >
        {toastMsg}
      </div>
    </div>
  );
}

function Field({ k, v, link }: { k: string; v: string; link?: string }) {
  if (!v) return null;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-[.5px] text-mut">{k}</div>
      <div className="break-words">
        {link ? (
          <a href={link} target={link.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">
            {v}
          </a>
        ) : (
          v
        )}
      </div>
    </div>
  );
}

const h3 =
  "mb-1.5 mt-[18px] border-b border-line pb-1 text-[13px] font-semibold uppercase tracking-[.6px] text-(--a)";
const lbl = "flex flex-col gap-[3px] text-[13px] text-mut";
const fgrid = "grid gap-x-4 gap-y-[10px] [grid-template-columns:repeat(auto-fit,minmax(230px,1fr))]";

function Detail({
  d,
  f,
  slug,
  onField,
  onQuestion,
  toast,
}: {
  d: ContactLite;
  f: Fiche;
  slug: OutilSlug;
  onField: (k: "statut" | "date" | "next" | "nextDate" | "notes", v: string) => void;
  onQuestion: (label: string, v: string) => void;
  toast: (t: string) => void;
}) {
  const cfg = OUTILS[slug].cfg;
  const scrRef = useRef<HTMLDivElement>(null);
  const tel = d.Téléphone;
  const mail = d.Email;
  const site = d["Site / formulaire"];
  const maps =
    "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(`${d.Organisation} ${d.Adresse} ${d.Ville}`);
  const accroche = d["Accroche premier contact"];

  function copy() {
    const fallback = () => {
      if (!scrRef.current) return;
      const r = document.createRange();
      r.selectNode(scrRef.current);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(r);
      toast("Texte sélectionné : Ctrl+C");
    };
    if (navigator.clipboard) navigator.clipboard.writeText(accroche).then(() => toast("Accroche copiée"), fallback);
    else fallback();
  }

  return (
    <>
      <h2 className="mb-0.5 font-serif text-xl font-semibold">{d.Organisation}</h2>
      <div className="mb-[10px] text-[13px] text-mut">
        {d["Sous-type"]} · {d.ID} · priorité {d.Priorité}
        {d["Note Google"] && ` · ${d["Note Google"]}/5 sur ${d["Nb avis"]} avis Google`}
      </div>

      {d["À vérifier"] && (
        <div className="my-2 rounded-md border border-warn-line bg-warn-bg px-[10px] py-[7px] text-[13px]">
          À vérifier : {d["À vérifier"]}
        </div>
      )}

      <div className="my-[10px] grid gap-x-4 gap-y-2 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
        <Field k="Adresse" v={[d.Adresse, d.Ville].filter(Boolean).join(" ")} link={maps} />
        <Field k="Téléphone" v={tel} link={/\d{2}/.test(tel) ? "tel:" + tel.replace(/[^\d+]/g, "") : ""} />
        <Field k="Email" v={mail} link={/@/.test(mail) && !/ /.test(mail.trim()) ? "mailto:" + mail : ""} />
        <Field k="Site" v={site ? site.replace(/^https?:\/\//, "").slice(0, 48) : ""} link={site} />
        <Field k="Contact" v={[d["Contact identifié"], d.Fonction].filter(Boolean).join(" — ")} />
        <Field k="Service / spécialité" v={d["Service / spécialité"]} />
        <Field k="Pourquoi eux" v={d["Intérêt pour KANAE"]} />
        <Field k="Ce qu'on peut obtenir" v={d["Ticket d'entrée / dispositif"]} />
      </div>

      <h3 className={h3}>Quoi dire</h3>
      <div ref={scrRef} className="my-2 rounded-md border-l-4 border-(--a) bg-soft px-3 py-[10px]">
        {accroche}
      </div>
      <button type="button" className={`${ctrl} no-print cursor-pointer`} onClick={copy}>
        Copier l&apos;accroche
      </button>

      <h3 className={h3}>Suivi</h3>
      <div className={fgrid}>
        <label className={lbl}>
          Statut
          <select className={`${ctrl} w-full`} value={f.statut} onChange={(e) => onField("statut", e.target.value)}>
            {cfg.statuts.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
        <label className={lbl}>
          Dernier contact
          <input type="date" className={`${ctrl} w-full`} value={f.date} onChange={(e) => onField("date", e.target.value)} />
        </label>
        <label className={lbl}>
          Prochaine action
          <input
            className={`${ctrl} w-full`}
            value={f.next}
            placeholder="ex. rappeler la gérante"
            onChange={(e) => onField("next", e.target.value)}
          />
        </label>
        <label className={lbl}>
          Date de relance
          <input
            type="date"
            className={`${ctrl} w-full`}
            value={f.nextDate}
            onChange={(e) => onField("nextDate", e.target.value)}
          />
        </label>
      </div>

      <h3 className={h3}>Réponses obtenues</h3>
      <div className={fgrid}>
        {cfg.questions.map(([label, type]) => {
          const v = f.q[label] ?? "";
          return (
            <div key={label} className={lbl}>
              <span>{label}</span>
              {type.startsWith("choix:") ? (
                <select
                  aria-label={label}
                  className={`${ctrl} w-full`}
                  value={v}
                  onChange={(e) => onQuestion(label, e.target.value)}
                >
                  <option value="" />
                  {type
                    .slice(6)
                    .split("|")
                    .map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                </select>
              ) : type.startsWith("choixMultiple:") ? (
                <div className="flex flex-wrap gap-2 pt-1">
                  {type
                    .slice("choixMultiple:".length)
                    .split("|")
                    .map((option) => {
                      const selected = v.split(" | ").includes(option);
                      return (
                        <label key={option} className="flex items-center gap-1.5 rounded-md border border-line bg-white px-2 py-1.5 text-ink">
                          <input
                            aria-label={option}
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              const values = new Set(v ? v.split(" | ") : []);
                              if (e.target.checked) values.add(option);
                              else values.delete(option);
                              onQuestion(label, [...values].join(" | "));
                            }}
                          />
                          {option}
                        </label>
                      );
                    })}
                </div>
              ) : (
                <input
                  aria-label={label}
                  className={`${ctrl} w-full`}
                  value={v}
                  onChange={(e) => onQuestion(label, e.target.value)}
                />
              )}
            </div>
          );
        })}
      </div>

      <h3 className={h3}>Notes</h3>
      <textarea
        aria-label="Notes"
        className={`${ctrl} min-h-20 w-full resize-y`}
        value={f.notes}
        placeholder="Ce qui s'est dit, objections, prochaine étape…"
        onChange={(e) => onField("notes", e.target.value)}
      />

      {f.hist.length > 0 && (
        <>
          <h3 className={h3}>Historique</h3>
          <ul className="mt-1.5 pl-[18px] text-[13px] text-mut">
            {f.hist
              .slice()
              .reverse()
              .map((x, i) => (
                <li key={i}>{x}</li>
              ))}
          </ul>
        </>
      )}
      {f.par && <p className="mt-3 text-xs text-mut">Dernière modification par {f.par}</p>}
    </>
  );
}
