"use client";
import { useEffect, useState, useRef } from "react";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Box, Stack, Text, Input, HStack, Button } from "@chakra-ui/react";
import WalletGenerator from "@/components/ui/WalletGenerator";
import { validateMnemonic, generateMnemonic } from "bip39";
import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";

const WalletPage = () => {
  const mnemonicInputRef = useRef<HTMLInputElement | null>(null);
  const { walletType } = useParams<{ walletType: string }>();
  const wallets: WalletsMap = JSON.parse(
    localStorage.getItem("wallets") || "{}"
  );

  if (!walletType) {
    <Navigate to="/" />;
  }

  const wallet = wallets[walletType].mnemonic;

  const [walletGenerated, setWalletGenerated] = useState(
    wallet.length !== 0 ? true : false
  );
  const [mnemonic, setMnemonic] = useState("");

  useEffect(() => {
    if (walletType && !walletGenerated) {
      toaster.create({
        id: "wallet-toast",
        title: `${walletType} Wallet selected`,
        description: "Please generate a wallet to continue.",
        closable: true,
        type: "success",
      });
      window.history.replaceState({}, document.title);
    }
  }, [walletType]);

  function mnemonicHandler(mnemonic: string): void {
    const cleanedMnemonic = mnemonic.trim();

    if (!cleanedMnemonic) {
      const newMnemonic = generateMnemonic(128);
      setMnemonic(newMnemonic);
      setWalletGenerated(true);
      return;
    }

    if (!validateMnemonic(cleanedMnemonic)) {
      toaster.create({
        id: "wallet-toast",
        title: "Incorrect Recovery Phrase",
        description: "Please generate a wallet to continue.",
        closable: true,
        type: "failure",
      });
      return;
    }

    setMnemonic(cleanedMnemonic);
    setWalletGenerated(true);
  }

  return (
    <Box p={6}>
      {walletGenerated ? (
        <WalletGenerator mnemonicValue={mnemonic} />
      ) : (
        <>
          <Stack>
            <Text fontSize={[35, 40, 45, 50]} fontWeight="bold" ml="-0.5">
              Secret Recovery Phrase
            </Text>
            <Text fontSize={[10, 15, 20, 25]} fontWeight="light" mt="-3">
              Save these words in a safe place.
            </Text>
            <HStack>
              <Input
                placeholder="Enter your secret phrase (or leave blank to generate)"
                fontFamily={"monospace"}
                size="md"
                variant="outline"
                ref={mnemonicInputRef}
                rounded="lg"
              />
              <Button
                px="10"
                onClick={() =>
                  mnemonicHandler(mnemonicInputRef.current?.value ?? "")
                }
                rounded="lg"
              >
                Generate Wallet
              </Button>
            </HStack>
          </Stack>
        </>
      )}
      <Toaster />
    </Box>
  );
};

export default WalletPage;
