import { useMutation } from "@tanstack/react-query";
import { type DemoContract } from "../lib/contract";
import { type FoundContract } from "@midnight-ntwrk/midnight-js/contracts";
import { setNetworkId } from "@midnight-ntwrk/midnight-js/network-id";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

export const useDepositToken = (
  foundContract: FoundContract<DemoContract>,
  connectedAPI: ConnectedAPI,
) => {
  const m = useMutation({
    mutationFn: depositToken,
  });

  async function depositToken(amount: number) {
    const networkId = (await connectedAPI!.getConfiguration()).networkId;

    setNetworkId(networkId);

    const callTxData = await foundContract!.callTx.receiveToken(BigInt(amount));

    console.log("calltxdata", callTxData);
  }

  return m;
};
