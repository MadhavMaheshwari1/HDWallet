"use client";

import { hdkey } from "ethereumjs-wallet";
import { toChecksumAddress } from "ethereumjs-util";
import { Keypair } from "@solana/web3.js";
import { mnemonicToSeedSync } from "bip39";
import React, { useState, useEffect } from "react";
import * as ed25519 from "ed25519-hd-key";
import { Card } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { Grid2x2 } from "lucide-react";
import { List } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const params = useParams();
  const router = useRouter();
  const walletType =
    typeof params.walletType === "string" ? params.walletType : "";
  const [visible, setVisible] = useState<Record<string, boolean[]>>({});
  const bgColor = useColorModeValue("#e2e2e2b8", "oklch(22% 0 0)");
  const bgHoverColor = useColorModeValue("#c7c7c7b8", "#707070a0");
  const textColor = useColorModeValue("gray.800", "gray.400");
  const storedWallets: WalletsMap =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("wallets") || "{}")
      : {};
  const [wallets, setWallets] = useState<WalletProvider>(
    storedWallets[walletType ?? "solana"] ?? { mnemonic: "", wallet: [] }
  );

  useEffect(() => {
    const storedWallets: WalletsMap =
      typeof window !== "undefined"
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
    const index = wallets.wallet.length;

    if (walletType === "solana") {
      const seed = mnemonicToSeedSync(mnemonicValue);
      const derivedSeed = ed25519.derivePath(
        `m/44'/501'/0'/0'/${index}'`,
        seed.toString("hex")
      ).key;
      const keypair = Keypair.fromSeed(derivedSeed);
      newWallet = {
        publicKey: keypair.publicKey.toBase58(),
        privateKey: Buffer.from(keypair.secretKey).toString("hex"),
      };
    } else if (walletType === "ethereum") {
      const seed = mnemonicToSeedSync(mnemonicValue);
      const hdWallet = hdkey.fromMasterSeed(seed);
      const key = hdWallet.derivePath(`m/44'/60'/0'/0/${index}`).getWallet();
      newWallet = {
        publicKey: toChecksumAddress(key.getAddressString()),
        privateKey: key.getPrivateKeyString(),
      };
    } else {
      return;
    }

    const storedWallets: WalletsMap =
      typeof window !== "undefined"
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
    setWallets((prev) => ({
      mnemonic: mnemonicValue,
      wallet: [...prev.wallet, newWallet],
    }));

    localStorage.setItem("wallets", JSON.stringify(storedWallets));
  };

  const handleWalletDeletion = (publicKey: string, allClear: boolean) => {
    const storedWallets: WalletsMap =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("wallets") || "{}")
        : {};

    if (allClear) {
      delete storedWallets[walletType ?? "solana"];
      localStorage.setItem("wallets", JSON.stringify(storedWallets));
      router.push("/");
      return;
    }

    const currWallet = wallets.wallet.filter(
      (val) => val.publicKey !== publicKey
    );
    setWallets({ mnemonic: mnemonicValue, wallet: currWallet });

    if (typeof window !== "undefined") {
      if (currWallet.length > 0) {
        storedWallets[walletType ?? "solana"] = {
          mnemonic: mnemonicValue,
          wallet: currWallet,
        };
      } else {
        delete storedWallets[walletType ?? "solana"];
        router.push("/");
      }
      localStorage.setItem("wallets", JSON.stringify(storedWallets));
    }
  };

  useEffect(() => {
    if (!walletType || !["solana", "ethereum"].includes(walletType)) {
      router.replace("/");
      return;
    }

    const storedWallets: WalletsMap =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("wallets") || "{}")
        : {};

    if (!storedWallets[walletType ?? "solana"]?.wallet?.length) {
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
                fontSize: val === walletType ? "1.5rem" : "0.75rem",
                textDecoration: val === walletType ? "underline" : "none",
                cursor: "pointer",
              }}
            >
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </Link>
          ))}
        </HStack>

        <HStack>
          <Button
            onClick={() =>
              setViewMode((prev) => (prev === "list" ? "card" : "list"))
            }
            color={useColorModeValue("black", "white")}
            bg="none"
          >
            {viewMode === "list" ? <List /> : <Grid2x2 />}
          </Button>
          <Button onClick={handleWalletGeneration}>Add wallet</Button>
          <Button
            bg={"red.700"}
            color={"white"}
            _hover={{ bg: "red.600" }}
            onClick={() => {
              dialog.open("a", {
                title: "Are you sure you want to delete all wallets?",
                description:
                  "This action cannot be undone. This will permanently delete your wallets and keys from local storage.",
                content: (
                  <HStack justifyContent="end" mt={4}>
                    <Button onClick={() => dialog.close("a")} rounded={"lg"}>
                      Cancel
                    </Button>
                    <Button
                      rounded={"lg"}
                      colorScheme="red"
                      onClick={() => {
                        handleWalletDeletion("", true);
                        dialog.close("a");
                      }}
                    >
                      Delete
                    </Button>
                  </HStack>
                ),
              });
            }}
          >
            Clear wallets
          </Button>
          <dialog.Viewport />
        </HStack>
      </HStack>
      {wallets.wallet.length > 0 &&
        (viewMode === "list" ? (
          // List view
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
                  onClick={() => handleWalletDeletion(val.publicKey, false)}
                >
                  <Trash2 size={18} color="red" />
                </IconButton>
              </HStack>
              <Stack bg={bgColor} rounded={"2xl"} p="6" gap="6">
                <Stack onClick={() => handleCopy("Public Key")}>
                  <Text fontWeight="medium" fontSize={[10, 15, 20, 25]}>
                    Public Key
                  </Text>
                  <Text
                    fontWeight="light"
                    mt="-1"
                    fontSize={[5, 10, 15, 20]}
                  >
                    {val.publicKey}
                  </Text>
                </Stack>
                <Stack>
                  <Text fontWeight="medium" fontSize={[10, 15, 20, 25]}>
                    Private Key
                  </Text>
                  <HStack mt="-1" justifyContent="space-between">
                    <Text
                      fontWeight="light"
                      fontSize={[5, 10, 15, 20]}
                    >
                      {visible[walletType]?.[i]
                        ? val.privateKey
                        : val.privateKey.replace(/./g, "•")}
                    </Text>
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
          ))
        ) : (
          // Grid view
          <SimpleGrid columns={[1, 2, 3]} gap="6">
            {wallets.wallet.map((val, i) => (
              <Card.Root
                key={i}
                width="100%"
                border="1px solid #a8a8a84c"
                rounded="2xl"
              >
                <Card.Body gap="4" p="0" rounded="2xl">
                  <HStack
                    justifyContent="space-between"
                    px="4"
                    py="2"
                    mt="2"
                    mb="-1"
                  >
                    <Card.Title fontSize={[16, 20, 24, 28]}>
                      Wallet {i + 1}
                    </Card.Title>
                    <IconButton
                      aria-label="Delete wallet"
                      onClick={() => handleWalletDeletion(val.publicKey, false)}
                      variant="ghost"
                    >
                      <Trash2 size={18} color="red" />
                    </IconButton>
                  </HStack>
                  <Stack bg={bgColor} px="4" py="4" rounded="xl">
                    <Stack onClick={() => handleCopy("Public Key")}>
                      <Text fontWeight="medium" fontSize={[5, 10, 15, 20]}>Public Key</Text>
                      <Text fontWeight="light" mt="-1" fontSize="sm">
                        {val.publicKey}
                      </Text>
                    </Stack>
                    <Stack>
                      <Text fontWeight="medium" fontSize={[5, 10, 15, 20]}>Private Key</Text>
                      <HStack mt="-1" justifyContent="space-between">
                        <Text
                          fontWeight="light"
                          fontSize="sm"
                          letterSpacing={"tighter"}
                          maxWidth="350px"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {visible[walletType]?.[i]
                            ? val.privateKey
                            : val.privateKey.replace(/./g, "•")}
                        </Text>
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
                </Card.Body>
              </Card.Root>
            ))}
          </SimpleGrid>
        ))}
    </>
  );
};

export default WalletGenerator;
