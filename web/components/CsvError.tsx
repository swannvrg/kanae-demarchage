export function CsvError({ file, error }: { file: string; error: string }) {
  return (
    <div role="alert" className="m-[18px] rounded-md border border-warn-line bg-warn-bg p-4 text-sm">
      <p className="font-semibold">Impossible de lire la base de contacts.</p>
      <p className="mt-1">{error}</p>
      <p className="mt-1 break-all text-mut">Fichier : {file}</p>
      <p className="mt-2">
        Vérifie que le CSV est bien dans le dossier parent de <code>web/</code>, ou indique son chemin avec la variable
        d&apos;environnement <code>KANAE_CSV_PATH</code>.
      </p>
    </div>
  );
}

export function Loading({ label = "Chargement de la base…" }: { label?: string }) {
  return <p className="p-[30px] text-center text-mut">{label}</p>;
}
