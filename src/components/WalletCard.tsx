import Button from "@mui/material/Button";
import React from "react";

export interface WalletCardProps {
  isConnected: boolean;
  walletAddress: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
}

const WalletCard: React.FC<WalletCardProps> = ({
  isConnected,
  walletAddress,
  onConnect,
  onDisconnect,
}) => {
  return (
    <div>
      <div>
        <h2>Connection Status</h2>
        <div>{isConnected ? "Connected" : "Disconnected"}</div>
      </div>

      <div>
        {isConnected && walletAddress ? (
          <>
            <p>Wallet Address:</p>
            <p title={walletAddress}>{walletAddress}</p>
          </>
        ) : (
          <p>Please connect your wallet to proceed.</p>
        )}
      </div>

      <div>
        {isConnected ? (
          <Button onClick={onDisconnect} variant="contained">
            Disconnect Wallet
          </Button>
        ) : (
          <Button onClick={onConnect} variant="contained">
            Connect Wallet
          </Button>
        )}
      </div>
    </div>
  );
};

export default WalletCard;
