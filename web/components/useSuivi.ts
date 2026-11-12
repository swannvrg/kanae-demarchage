"use client";

import { useSyncExternalStore } from "react";
import { readMe, readSuivi, serverSuivi, subscribe } from "@/lib/suivi";

/** Suivi d'un outil lu dans le localStorage (réactif, synchronisé entre onglets). */
export function useSuivi(key: string) {
  return useSyncExternalStore(subscribe, () => readSuivi(key), serverSuivi);
}

export function useMe() {
  return useSyncExternalStore(subscribe, readMe, () => "");
}
