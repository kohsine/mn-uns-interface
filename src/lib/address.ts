import {
  MidnightBech32m,
  UnshieldedAddress,
} from "@midnight-ntwrk/wallet-sdk-address-format";

export function convertBech32ToUserAddress(b32: string, networkId: string) {
  const parsed = MidnightBech32m.parse(b32 ?? "").decode(
    UnshieldedAddress,
    networkId,
  );
  const userAddress = new Uint8Array(parsed.data);
  return userAddress;
}
