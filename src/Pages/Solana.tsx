import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toaster,Toaster } from "@/components/ui/toaster";
import { Box } from "@chakra-ui/react";

const Solana = () => {
  const location = useLocation();
  const wallet = location.state?.selectedWallet;

  useEffect(() => {
    if (wallet) {
      toaster.create({
        title: `${wallet} Wallet selected`,
        description: "Please generate a wallet to continue.",
      });
    }

    window.history.replaceState({}, document.title);

  }, [wallet]);

  return <Box>Solana<Toaster /></Box>;
};

export default Solana;
