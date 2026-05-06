import { useQuery } from "@tanstack/react-query";
import { setNetworkId } from "@midnight-ntwrk/midnight-js/network-id";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

export const useFetchBalance = (connectedAPI: ConnectedAPI) => {
  const q = useQuery({
    queryKey: ["getBalance", connectedAPI],
    queryFn: getBalance,
    enabled: connectedAPI != null,
  });

  async function getBalance() {
    const networkId = (await connectedAPI!.getConfiguration()).networkId;

    setNetworkId(networkId);

    const data = await connectedAPI?.getUnshieldedBalances();

    console.log("balances", data);

    return data;
  }

  return q;
};
