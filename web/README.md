# KANAE — site de démarchage

Réunit les trois outils `KANAE_Demarchage_*.html` en un seul site Next.js et lit la base
`KANAE_base_prospection_marseille_lyocell.csv` (dossier parent).

## Lancer

```bash
npm install
npm run dev
```

Puis ouvrir http://localhost:3000.

## Pages

- `/` : tableau de bord (contacts, déjà contactés, positifs, relances du jour)
- `/salons`, `/labos`, `/recyclage` : outils de suivi (lignes SAL, LAB, REC)
- `/contacts` : toute la base en lecture seule, recherche et filtre par type

## Données

- **Contacts** : relus dans le CSV à chaque chargement de page. Autre emplacement :
  variable `KANAE_CSV_PATH` (chemin absolu ou relatif à `web/`), par ex. dans `.env.local`.
- **Suivi** : localStorage du navigateur, mêmes clés et même format que les fichiers HTML
  (`kanae_salons`, `kanae_labos`, `kanae_recyclage`, `kanae_me`). Export / import CSV
  compatibles dans les deux sens ; à l'import, la fiche la plus récente (`_maj`) l'emporte.
- Configurations des outils (objectifs, statuts, questions) : `lib/config.ts`, reprises des `CFG` HTML.
