import React,{useEffect} from "react";
import { useLocation } from "react-router-dom";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Box } from "@chakra-ui/react";

const Ethereum = () => {
  const location = useLocation();
  const wallet = location.state?.selectedWallet;
  const fromHome = location.state?.fromHome;

  useEffect(() => {
    if (wallet && fromHome) {
      toaster.create({
        title: `${wallet} Wallet selected`,
        description: "Please generate a wallet to continue.",
      });
    }
  }, [wallet]);
  return (
    <Box>
      Ethereum
      <Toaster />
    </Box>
  );
};

export default Ethereum;
