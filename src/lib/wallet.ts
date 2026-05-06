import type { InitialAPI } from "@midnight-ntwrk/dapp-connector-api";

export function findInitialAPIs(): InitialAPI[] {
  const midnight = window.midnight;
  if (!midnight) return [];

  const apis: InitialAPI[] = [];
  for (const key of Object.keys(midnight)) {
    const candidate = midnight[key];
    if (
      candidate &&
      typeof candidate === "object" &&
      typeof candidate.name === "string" &&
      typeof candidate.icon === "string" &&
      typeof candidate.apiVersion === "string" &&
      typeof candidate.connect === "function"
    ) {
      apis.push(candidate as InitialAPI);
    }
  }
  return apis;
}
