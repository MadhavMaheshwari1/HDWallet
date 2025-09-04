"use client";

import { hdkey } from "ethereumjs-wallet";
import { toChecksumAddress } from "ethereumjs-util";
import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  SimpleGrid,
  Box,
  HStack,
  Text,
  IconButton,
  Stack,
  Button,
} from "@chakra-ui/react";
import { Dialog, Portal, createOverlay } from "@chakra-ui/react";
import { ChevronDown, Copy, Eye, EyeOff, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@ark-ui/react";

import { toaster } from "@/components/ui/toaster";
import { useColorModeValue } from "./color-mode";

interface DialogProps {
  title: string;
  description?: string;
  content?: React.ReactNode;
}

const chains = ["solana", "ethereum"];

const dialog = createOverlay<DialogProps>((props) => {
  const { title, description, content, ...rest } = props;
  return (
    <Dialog.Root {...rest} closeOnInteractOutside={false} closeOnEscape={false}>
      <Portal>
        <Dialog.Backdrop
          style={{
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(2px)",
            pointerEvents: "auto",
          }}
        />
        <Dialog.Positioner
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
          }}
        >
          <Dialog.Content border="1px solid #a8a8a84c">
            {title && (
              <Dialog.Header>
                <Dialog.Title>{title}</Dialog.Title>
              </Dialog.Header>
            )}
            <Dialog.Body spaceY="4">
              {description && (
                <Dialog.Description>{description}</Dialog.Description>
              )}
              {content}
            </Dialog.Body>
            <Dialog.Footer>
              <HStack justifyContent="end">
                <Button rounded="lg" onClick={() => dialog.close("a")}>
                  Cancel
                </Button>
                <Button rounded="lg" colorScheme="red">
                  Delete
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
});

interface WalletGeneratorProps {
  mnemonicValue: string;
}

const WalletGenerator: React.FC<WalletGeneratorProps> = ({ mnemonicValue }) => {
  const params = useParams();
  const router = useRouter();
  const walletType = typeof params.walletType === "string" ? params.walletType : "";
  const [visible, setVisible] = useState<Record<string, boolean[]>>({});
  const bgColor = useColorModeValue("#e2e2e2b8", "#3b3b3ba0");
  const bgHoverColor = useColorModeValue("#c7c7c7b8", "#707070a0");
  const textColor = useColorModeValue("gray.800", "gray.400");
  const storedWallets: WalletsMap = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("wallets") || "{}")
    : {};
  const [wallets, setWallets] = useState<WalletProvider>(
    storedWallets[walletType ?? "solana"] ?? { mnemonic: "", wallet: [] }
  );

  useEffect(() => {
    const storedWallets: WalletsMap = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wallets") || "{}")
      : {};
    setWallets(
      storedWallets[walletType ?? "solana"] ?? { mnemonic: "", wallet: [] }
    );
  }, [walletType]);

  const [Open, setOpen] = useState(false);

  useEffect(() => {
    setVisible((prev) => ({
      ...prev,
      [walletType ?? "solana"]: Array(wallets.wallet.length).fill(false),
    }));
  }, [walletType, wallets.wallet.length]);

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
    } else {
      return;
    }

    setWallets((prev) => ({
      mnemonic: mnemonicValue,
      wallet: [...prev.wallet, newWallet],
    }));

    const storedWallets: WalletsMap = typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wallets") || "{}")
      : {};

    if (storedWallets[walletType ?? "solana"]) {
      storedWallets[walletType ?? "solana"].wallet.push(newWallet);
    } else {
      storedWallets[walletType ?? "solana"] = {
        mnemonic: mnemonicValue,
        wallet: [newWallet],
      };
    }

    localStorage.setItem("wallets", JSON.stringify(storedWallets));
  };

  useEffect(() => {
    if (!walletType || !["solana", "ethereum"].includes(walletType)) {
      router.replace("/");
      return;
    }
    if (!wallets.mnemonic) {
      handleWalletGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletType]);

  let displayMnemonic = mnemonicValue;
  if (wallets.mnemonic) {
    displayMnemonic = wallets.mnemonic;
  }

  const handleCopy = async (val: string) => {
    if (displayMnemonic) {
      await navigator.clipboard.writeText(displayMnemonic);
      toaster.create({
        title: `${val} copied to clipboard`,
        type: "success",
        duration: 2000,
        closable: true,
      });
    }
  };

  const toggleVisibility = (index: number) => {
    setVisible((prev) => ({
      ...prev,
      [walletType]: prev[walletType].map((v, i) => (i === index ? !v : v)),
    }));
  };

  return (
    <>
      <AccordionRoot collapsible>
        <AccordionItem value="secret-phrase">
          <Box border={`1px solid #a8a8a84c`} borderRadius="lg" p="6">
            <AccordionItemTrigger
              onClick={() => setOpen((prev) => !prev)}
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
            {Open && (
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <AccordionItemContent>
                  <Box
                    pb={4}
                    cursor="pointer"
                    onClick={() => handleCopy("Secret Phrase")}
                    borderRadius="md"
                    p={2}
                    pl={0.5}
                  >
                    <SimpleGrid columns={[2, 3, 4]} gap="2">
                      {displayMnemonic
                        .split(" ")
                        .map((word: string, index: number) => (
                          <Box
                            _hover={{
                              bg: `${bgHoverColor}`,
                              transition: "background 0.5s ease",
                            }}
                            key={index}
                            borderWidth="1px"
                            rounded="md"
                            fontFamily="monospace"
                            bg={`${bgColor}`}
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
                    color={`${textColor}`}
                    fontWeight="medium"
                    display="flex"
                    gap="2"
                    onClick={() => handleCopy("Secret Phrase")}
                    _hover={{
                      color: "#565656ee",
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
      <HStack w={"100%"} justifyContent={"space-between"} my={"8"}>
        <HStack
          border="1px solid #a8a8a84c"
          rounded="lg"
          bg={bgColor}
          px="6"
          py="4"
        >
          {chains.map((val, ind) => (
            <Link
              key={ind}
              href={`/${val}`}
              style={{
                fontWeight: val === walletType ? "bold" : "normal",
                fontSize: val === walletType ? "1.5rem" : "1rem",
                textDecoration: val === walletType ? "underline" : "none",
                cursor: "pointer",
              }}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </Link>
          ))}
        </HStack>

        <HStack>
          <Button>Add wallet</Button>
          <Button
            bg={"red.700"}
            color={"white"}
            _hover={{ bg: "red.600" }}
            onClick={() => {
              dialog.open("a", {
                title: "Are you sure you want to delete all wallets?",
                description:
                  "This action cannot be undone. This will permanently delete your wallets and keys from local storage.",
              });
            }}
          >
            Clear wallets
          </Button>
          <dialog.Viewport />
        </HStack>
      </HStack>
      {wallets.wallet.length > 0 &&
        wallets.wallet.map((val, i) => (
          <Box key={i} border="1px solid #a8a8a84c" rounded="2xl" mb="4">
            <HStack justifyContent={"space-between"}>
              <Text p="6" fontSize={[16, 20, 24, 28]} fontWeight={"bold"}>
                Wallet {i + 1}
              </Text>
              <IconButton
                aria-label="Delete"
                variant="ghost"
                colorScheme="red"
                mr="4"
              >
                <Trash2 size={18} color="red" />
              </IconButton>
            </HStack>
            <Stack key={i} bg={`${bgColor}`} rounded={"2xl"} p="6" gap="6">
              <Stack onClick={() => handleCopy("Public Key")}>
                <Text fontSize={[10, 14, 18, 22]} fontWeight={"medium"}>
                  Public Key
                </Text>
                <Text fontSize={[4, 8, 12, 16]} fontWeight={"light"} mt="-1">
                  {val.publicKey}
                </Text>
              </Stack>
              <Stack>
                <Text fontSize={[10, 14, 18, 22]} fontWeight={"medium"}>
                  Private Key
                </Text>
                <HStack mt={"-3"} justifyContent={"space-between"}>
                  {visible[walletType]?.[i] ? (
                    <Text
                      letterSpacing={"tighter"}
                      fontSize={[4, 8, 12, 16]}
                      fontWeight={"light"}
                    >
                      {val.privateKey}
                    </Text>
                  ) : (
                    <Text
                      letterSpacing={"widest"}
                      fontSize={[4, 8, 12, 16]}
                      fontWeight={"light"}
                    >
                      {val.privateKey.replace(/./g, "•")}
                    </Text>
                  )}
                  <IconButton
                    aria-label="Toggle private key"
                    onClick={() => toggleVisibility(i)}
                    size="sm"
                    variant="ghost"
                  >
                    {visible[walletType]?.[i] ? <EyeOff /> : <Eye />}
                  </IconButton>
                </HStack>
              </Stack>
            </Stack>
          </Box>
        ))}
    </>
  );
};

export default WalletGenerator;