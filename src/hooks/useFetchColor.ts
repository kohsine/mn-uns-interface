import { useQuery } from "@tanstack/react-query";
import { contractAddress, type DemoProviders } from "../lib/contract";
import { getPublicStates } from "@midnight-ntwrk/midnight-js/contracts";
import { setNetworkId } from "@midnight-ntwrk/midnight-js/network-id";
import * as CompiledOutput from "../compiled/contract";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";
import { rawTokenType } from "@midnight-ntwrk/ledger-v8";

export const useFetchColor = (
  providers: DemoProviders,
  connectedAPI: ConnectedAPI,
) => {
  const q = useQuery({
    queryKey: ["getColor", contractAddress],
    queryFn: getColor,
    enabled: providers != null,
  });

  async function getColor() {
    console.log("finding");

    const networkId = (await connectedAPI!.getConfiguration()).networkId;

    setNetworkId(networkId);

    const publicStates = await getPublicStates(
      providers?.publicDataProvider!,
      contractAddress,
    );

    const contractState = publicStates.contractState;

    const ds = CompiledOutput.ledger(contractState.data).domainSep;

    const color = rawTokenType(ds, contractAddress);

    console.log("color", color);

    return color;
  }

  return q;
};
