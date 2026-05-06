import { levelPrivateStateProvider } from "@midnight-ntwrk/midnight-js-level-private-state-provider";
import { indexerPublicDataProvider } from "@midnight-ntwrk/midnight-js-indexer-public-data-provider";
import { FetchZkConfigProvider } from "@midnight-ntwrk/midnight-js-fetch-zk-config-provider";
import { httpClientProofProvider } from "@midnight-ntwrk/midnight-js-http-client-proof-provider";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

import {
  createWalletProvidersFromConnectedAPI,
  type ShieldedAddress,
} from "./walletAdapter";
import { type DemoCircuits, type DemoProviders } from "./contract";

export const networkId = "undeployed";

export async function buildProvidersFromConnectedAPI(
  connectedAPI: ConnectedAPI,
): Promise<DemoProviders> {
  const zkConfigHttpBase = window.location.origin + "/compiled/";
  console.log("zkConfigHttpBase", zkConfigHttpBase);
  const zkConfigProvider = new FetchZkConfigProvider<DemoCircuits>(
    zkConfigHttpBase,
    fetch.bind(window),
  );

  const config = await connectedAPI.getConfiguration();
  console.log("config", config);
  const publicDataProvider = indexerPublicDataProvider(
    config.indexerUri,
    config.indexerWsUri,
  );

  const proofProvider = httpClientProofProvider(
    config.proverServerUri!,
    zkConfigProvider,
  );

  const shieldedAddress: ShieldedAddress =
    await connectedAPI.getShieldedAddresses();

  const { walletProvider, midnightProvider } =
    createWalletProvidersFromConnectedAPI(connectedAPI, shieldedAddress);

  const accountId = (await connectedAPI.getUnshieldedAddress())
    .unshieldedAddress;

  const privateStateProvider = levelPrivateStateProvider({
    privateStateStoreName: "unshielded-private-state",
    privateStoragePasswordProvider: () => "DEVelopmentdevelopment111%",
    accountId,
  });

  return {
    privateStateProvider,
    publicDataProvider,
    zkConfigProvider,
    proofProvider,
    walletProvider,
    midnightProvider,
  };
}
