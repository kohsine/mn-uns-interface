import { useState } from "react";
import { findInitialAPIs } from "../lib/wallet";
import { buildProvidersFromConnectedAPI, networkId } from "../lib/providers";
import type { DemoProviders } from "../lib/contract";
import type { ConnectedAPI } from "@midnight-ntwrk/dapp-connector-api";

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [providers, setProviders] = useState<DemoProviders | null>(null);
  const [connectedApi, setConnectedApi] = useState<ConnectedAPI | null>(null);

  const handleConnect = async () => {
    console.log("Connect button clicked");
    let isConnected = false;
    let address = null;

    try {
      // Access the Midnight Lace wallet through the window object
      const wallet = findInitialAPIs()[0];

      // Connect to the specified network (use 'undeployed' for local development)
      const connectedApi = await wallet.connect(networkId);
      setConnectedApi(connectedApi);

      // Retrieve the shielded addresses from the wallet
      const addresses = await connectedApi.getShieldedAddresses();
      address = addresses.shieldedAddress;

      // Optional: Get the service URI configuration
      const serviceUriConfig = await connectedApi.getConfiguration();
      console.log("Service URI Config:", serviceUriConfig);

      // Check if the connection is established
      const connectionStatus = await connectedApi.getConnectionStatus();
      if (connectionStatus) {
        isConnected = true;
        console.log("Connected to the wallet:", address);
      }

      const demoCircuitsMidnightProviders =
        await buildProvidersFromConnectedAPI(connectedApi);
      setProviders(demoCircuitsMidnightProviders);
    } catch (error) {
      console.log("An error occurred:", error);
    }

    setIsConnected(isConnected);
    setWalletAddress(address);
  };

  const handleDisconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  return {
    handleConnect,
    handleDisconnect,
    isConnected,
    walletAddress,
    providers,
    connectedApi,
  };
};
