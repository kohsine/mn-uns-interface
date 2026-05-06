import { useMutation } from "@tanstack/react-query";
import { setNetworkId } from "@midnight-ntwrk/midnight-js/network-id";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

export const useSendToken = (connectedAPI: ConnectedAPI) => {
  const m = useMutation({
    mutationFn: sendToken,
  });

  async function sendToken({
    tokenType,
    amount,
    recipient,
  }: {
    tokenType: string;
    amount: number;
    recipient: string;
  }) {
    const networkId = (await connectedAPI!.getConfiguration()).networkId;

    setNetworkId(networkId);

    console.log(
      "tokenType",
      tokenType,
      "amount",
      amount,
      "recipient",
      recipient,
    );

    const tx = await connectedAPI?.makeTransfer([
      {
        kind: "unshielded",
        type: tokenType,
        value: BigInt(amount),
        recipient,
      },
    ]);

    const balanced = await connectedAPI?.balanceSealedTransaction(tx!.tx);

    await connectedAPI?.submitTransaction(balanced!.tx);
  }

  return m;
};
