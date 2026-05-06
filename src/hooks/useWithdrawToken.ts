import { useMutation } from "@tanstack/react-query";
import { type DemoContract } from "../lib/contract";
import { type FoundContract } from "@midnight-ntwrk/midnight-js/contracts";
import { setNetworkId } from "@midnight-ntwrk/midnight-js/network-id";
import { convertBech32ToUserAddress } from "../lib/address";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

export const useWithdrawToken = (
  foundContract: FoundContract<DemoContract>,
  connectedAPI: ConnectedAPI,
) => {
  const m = useMutation({
    mutationFn: withdrawToken,
  });

  async function withdrawToken({
    amount,
    recipient,
  }: {
    amount: number;
    recipient: string;
  }) {
    const networkId = (await connectedAPI!.getConfiguration()).networkId;

    setNetworkId(networkId);

    const userAddress = convertBech32ToUserAddress(recipient, networkId);

    const callTxData = await foundContract!.callTx.sendToken(BigInt(amount), {
      bytes: userAddress,
    });

    console.log("calltxdata", callTxData);
  }

  return m;
};
