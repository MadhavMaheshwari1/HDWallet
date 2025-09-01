import { hdkey } from "ethereumjs-wallet";
import { toChecksumAddress } from "ethereumjs-util";
import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import React, { useState, useEffect } from "react";
import { SimpleGrid, Box, HStack, Text } from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { Copy } from "lucide-react";
import nacl from "tweetnacl";
import { Navigate } from "react-router-dom";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@ark-ui/react";

import { toaster } from "@/components/ui/toaster";
import { useParams } from "react-router-dom";

const WalletGenerator = ({ mnemonicValue }) => {
  const { walletType } = useParams<{ walletType: string }>();
  if (!walletType) {
    <Navigate to="/" />;
  }
  const storedWallets: WalletsMap = JSON.parse(
    localStorage.getItem("wallets") || "{}"
  );

  const [wallets, setWallets] = useState<WalletProvider>(
    storedWallets[walletType] ?? { mnemonic: "", wallet: [] }
  );

  if (wallets.mnemonic) {
    mnemonicValue = wallets.mnemonic;
  }

  const [isOpen, setIsOpen] = useState(false);

  const handleCopy = async () => {
    if (mnemonicValue) {
      await navigator.clipboard.writeText(mnemonicValue);
      toaster.create({
        title: "Secret phrase copied to clipboard",
        type: "success",
        duration: 2000,
      });
    }
  };

const handleWalletGeneration = () => {
  let newWallet: WalletAccount;

  if (walletType === "solana") {
    const seed = mnemonicToSeedSync(mnemonicValue).slice(0, 32);
    const keypair = Keypair.fromSeed(seed);
    newWallet = {
      publicKey: keypair.publicKey.toBase58(),
      privateKey: Buffer.from(keypair.secretKey).toString("hex"),
    };
  } else if (walletType === "ethereum") {
    const seed = mnemonicToSeedSync(mnemonicValue);
    const hdWallet = hdkey.fromMasterSeed(seed);
    const key = hdWallet.derivePath("m/44'/60'/0'/0/0").getWallet();
    newWallet = {
      publicKey: toChecksumAddress(key.getAddressString()),
      privateKey: key.getPrivateKeyString(),
    };
  }

  setWallets((prev) => ({
    mnemonic: mnemonicValue,
    wallet: [...prev.wallet, newWallet],
  }));

  const storedWallets: WalletsMap = JSON.parse(
    localStorage.getItem("wallets") || "{}"
  );

  if (storedWallets[walletType]) {
    storedWallets[walletType].wallet.push(newWallet);
  } else {
    storedWallets[walletType] = { mnemonic: mnemonicValue, wallet: [newWallet] };
  }

  localStorage.setItem("wallets", JSON.stringify(storedWallets));
};

  useEffect(() => {
    if (!wallets.mnemonic) {
      handleWalletGeneration();
    }
  }, []);

  return (
    <>
      <AccordionRoot collapsible>
        <AccordionItem value="secret-phrase">
          <Box border="1px solid #ffffff2d" borderRadius="lg" p="6">
            <AccordionItemTrigger
              onClick={() => setIsOpen((prev) => !prev)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                cursor: "pointer",
                alignItems: "center",
                padding: "8px 2px",
              }}
            >
              <HStack justifyContent="space-between" w="100%">
                <Text fontWeight="bold" fontSize="2xl">
                  Your Secret Phrase
                </Text>
                <Text>
                  <ChevronDown size={20} />
                </Text>
              </HStack>
            </AccordionItemTrigger>
            {isOpen && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AccordionItemContent>
                  <Box
                    pb={4}
                    cursor="pointer"
                    onClick={handleCopy}
                    borderRadius="md"
                    p={2}
                    pl={0.5}
                  >
                    <SimpleGrid columns={[2, 3, 4]} gap="2">
                      {mnemonicValue
                        .split(" ")
                        .map((word: string, index: number) => (
                          <Box
                            _hover={{
                              bg: "gray.800",
                              transition: "background 0.5s ease",
                            }}
                            key={index}
                            borderWidth="1px"
                            rounded="md"
                            fontFamily="monospace"
                            bg="#2626265b"
                            color="white"
                            textAlign="left"
                            py={3}
                            px={4}
                            fontSize={[2, 4, 6, 20]}
                          >
                            {word}
                          </Box>
                        ))}
                    </SimpleGrid>
                  </Box>
                  <Text
                    mt={2}
                    ml="1"
                    cursor="pointer"
                    fontSize="md"
                    color="gray.400"
                    fontWeight="medium"
                    display="flex"
                    gap="2"
                    onClick={handleCopy}
                    _hover={{
                      color: "#f1ededee",
                      transition: "color 0.7s ease-in-out",
                    }}
                  >
                    <Copy /> Click Anywhere To Copy
                  </Text>
                </AccordionItemContent>
              </motion.div>
            )}
          </Box>
        </AccordionItem>
      </AccordionRoot>
    </>
  );
};

export default WalletGenerator;
