/** Classes partagées (charte des fichiers HTML, zones tactiles ≥ 44 px). */

/** Conteneur centré avec marges. */
export const WRAP = "mx-auto w-full max-w-7xl px-4 sm:px-6";

/** Champ / bouton de base. */
export const CTRL =
  "min-h-11 rounded-md border border-line bg-white px-3 py-2 text-ink [font:inherit] focus:border-(--a) focus:outline-none";

/** Bouton principal à la couleur d'accent (texte blanc : contraste AA sur les 3 accents). */
export const BTN_PRIMARY =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-(--a) bg-(--a) px-4 py-2 text-center font-semibold text-white no-underline hover:opacity-90";

/** Bouton secondaire. */
export const BTN =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-line bg-white px-4 py-2 text-center text-ink no-underline hover:bg-soft";
