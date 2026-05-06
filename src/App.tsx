import React, { Fragment, useState } from "react";
import WalletCard from "./components/WalletCard";
import "@midnight-ntwrk/dapp-connector-api";
import { useWallet } from "./hooks/useWallet";
import { useFetchColor } from "./hooks/useFetchColor";
import { useMintToken } from "./hooks/useMintToken";
import { useDeployedContract } from "./hooks/useDeployedContract";
import Button from "@mui/material/Button";
import { useFetchBalance } from "./hooks/useFetchBalance";
import { useDepositToken } from "./hooks/useDepositToken";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useWithdrawToken } from "./hooks/useWithdrawToken";

const App: React.FC = () => {
  const {
    isConnected,
    walletAddress,
    handleConnect,
    handleDisconnect,
    providers,
    connectedApi,
  } = useWallet();
  console.log("providers", providers);
  const { data: color, error } = useFetchColor(providers!, connectedApi!);
  const { data: foundContract } = useDeployedContract(providers!);
  const { mutateAsync: mintToken, isPending: pendingMint } = useMintToken(
    foundContract!,
    connectedApi!,
  );
  const { data: balances } = useFetchBalance(connectedApi!);
  const { mutateAsync: depositToken, isPending: pendingDeposit } =
    useDepositToken(foundContract!, connectedApi!);
  const {
    mutateAsync: withdrawToken,
    isPending: pendingWithdraw,
    error: errorWithdraw,
  } = useWithdrawToken(foundContract!, connectedApi!);

  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawRecipient, setWithdrawRecipient] = useState("");

  const [mintAmount, setMintAmount] = useState("");
  const [mintRecipient, setMintRecipient] = useState("");

  const [depositAmount, setDepositAmount] = useState("");

  console.log("color", color, "error", error, "withdraw error", errorWithdraw);

  async function onMint() {
    console.log("minting");

    await mintToken({ amount: parseInt(mintAmount), recipient: mintRecipient });
  }

  async function onDeposit() {
    console.log("depositing");

    await depositToken(parseInt(depositAmount));
  }

  async function onWithdraw() {
    console.log("withdrawing");

    await withdrawToken({
      amount: parseInt(withdrawAmount),
      recipient: withdrawRecipient,
    });
  }

  return (
    <div>
      <header>
        <h1>Unshielded Token</h1>
      </header>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "48px",
        }}
      >
        <WalletCard
          isConnected={isConnected}
          walletAddress={walletAddress}
          onConnect={handleConnect}
          onDisconnect={handleDisconnect}
        />

        <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            onClick={onMint}
            variant="contained"
            disabled={foundContract == null}
            loading={pendingMint}
            sx={{ width: "fit-content" }}
          >
            mint
          </Button>
          <TextField
            label="Amount"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setMintAmount(e.target.value)}
          ></TextField>
          <TextField
            label="Recipient"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setMintRecipient(e.target.value)}
          ></TextField>
        </Box>

        <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            onClick={onDeposit}
            variant="contained"
            disabled={foundContract == null}
            loading={pendingDeposit}
            sx={{ width: "fit-content" }}
          >
            deposit
          </Button>
          <TextField
            label="Amount"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setDepositAmount(e.target.value)}
          ></TextField>
        </Box>

        <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            onClick={onWithdraw}
            variant="contained"
            disabled={foundContract == null}
            loading={pendingWithdraw}
            sx={{ width: "fit-content" }}
          >
            Withdraw
          </Button>
          <TextField
            label="Amount"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setWithdrawAmount(e.target.value)}
          ></TextField>
          <TextField
            label="Recipient"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setWithdrawRecipient(e.target.value)}
          ></TextField>
        </Box>

        {/* Currently bugged */}
        {/* <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            onClick={onSend}
            variant="contained"
            disabled={foundContract == null}
            loading={pendingSend}
            sx={{ width: "fit-content" }}
          >
            Send
          </Button>
          <TextField
            label="Amount"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setSendAmount(e.target.value)}
          ></TextField>
          <TextField
            label="Recipient"
            variant="filled"
            disabled={foundContract == null}
            onChange={(e) => setSendRecipient(e.target.value)}
          ></TextField>
        </Box> */}

        <Box>
          {Object.entries(balances ?? {}).map((t, i) => {
            return (
              <Fragment key={i}>
                <Typography>Token type: {t[0]}</Typography>
                <Typography>Balance: {t[1]}</Typography>
              </Fragment>
            );
          })}
        </Box>
      </Box>
    </div>
  );
};

export default App;
