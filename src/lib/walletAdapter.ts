import {
  type UnboundTransaction,
  type WalletProvider,
} from "@midnight-ntwrk/midnight-js/types";
import {
  Binding,
  type CoinPublicKey,
  type EncPublicKey,
  type FinalizedTransaction,
  Proof,
  SignatureEnabled,
  Transaction,
} from "@midnight-ntwrk/ledger-v8";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

export type ShieldedAddress = {
  shieldedAddress: string;
  shieldedCoinPublicKey: string;
  shieldedEncryptionPublicKey: string;
};

export function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToUint8Array(hex: string): Uint8Array {
  const cleaned = hex.replace(/^0x/, "");
  const matches = cleaned.match(/.{1,2}/g);
  if (!matches) return new Uint8Array();
  return new Uint8Array(matches.map((byte) => parseInt(byte, 16)));
}

export function createWalletProvidersFromConnectedAPI(
  connectedAPI: ConnectedAPI,
  shieldedAddress: ShieldedAddress,
) {
  const walletProvider: WalletProvider = {
    getCoinPublicKey(): CoinPublicKey {
      return shieldedAddress.shieldedCoinPublicKey;
    },
    getEncryptionPublicKey(): EncPublicKey {
      return shieldedAddress.shieldedEncryptionPublicKey;
    },
    async balanceTx(tx: UnboundTransaction): Promise<FinalizedTransaction> {
      try {
        const serialized = tx.serialize();

        const serializedStr = uint8ArrayToHex(serialized);

        const result =
          await connectedAPI.balanceUnsealedTransaction(serializedStr);

        const resultBytes = hexToUint8Array(result.tx);

        const deserializedTx = Transaction.deserialize(
          "signature",
          "proof",
          "binding",
          resultBytes,
        ) as Transaction<SignatureEnabled, Proof, Binding>;

        return deserializedTx;
      } catch (error) {
        console.error(
          "[WalletAdapter] balanceTx: Error during transaction balancing:",
          error,
        );
        throw error;
      }
    },
  };

  const midnightProvider = {
    async submitTx(tx: FinalizedTransaction): Promise<string> {
      try {
        const serialized = tx.serialize();

        const serializedStr = uint8ArrayToHex(serialized);

        await connectedAPI.submitTransaction(serializedStr);

        const txId = tx.identifiers()[0];

        return txId;
      } catch (error) {
        console.error(
          "[WalletAdapter] submitTx: Error during transaction submission:",
          error,
        );
        throw error;
      }
    },
  };

  return { walletProvider, midnightProvider };
}
