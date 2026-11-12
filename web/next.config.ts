import path from "node:path";
import type { NextConfig } from "next";

/**
 * La base CSV est dans le dossier parent de web/ (racine du dépôt).
 * Next.js n'embarque dans les fonctions serveur que les fichiers qu'il détecte :
 * on trace depuis la racine du dépôt et on inclut explicitement le CSV, sinon il
 * manque en production (Vercel : « Fichier introuvable »).
 */
const CSV = "../KANAE_base_prospection_marseille_lyocell.csv";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  outputFileTracingRoot: path.join(__dirname, ".."),
  outputFileTracingIncludes: {
    "/": [CSV],
    "/*": [CSV],
  },
  turbopack: {
    root: path.join(__dirname, ".."),
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
