import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toaster, Toaster } from "@/components/ui/toaster";
import { Copy } from "lucide-react";
import { motion } from "framer-motion";
import { useRef } from "react";
import {
  Box,
  Stack,
  Text,
  Input,
  Button,
  HStack,
  SimpleGrid,
} from "@chakra-ui/react";
import { ChevronDown } from "lucide-react";
import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent,
} from "@ark-ui/react";

import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english";

const MotionStack = motion(Stack);

const Solana = () => {
  const location = useLocation();
  const phraseRef = useRef<HTMLInputElement>(null);
  const wallet = location.state?.selectedWallet;
  const [isOpen, setIsOpen] = useState(false);

  const [secretPhrase, setSecretPhrase] = useState<string>("");

  const generateSecretPhrase = () => {
    let mnemonic = phraseRef.current?.value?.trim();

    if (!mnemonic) {
      mnemonic = generateMnemonic(wordlist, 128);
    }
    setSecretPhrase(mnemonic);
  };

  const handleCopy = async () => {
    console.log(secretPhrase);
    if (secretPhrase) {
      await navigator.clipboard.writeText(secretPhrase);
      toaster.create({
        title: "Secret phrase copied to clipboard",
        type: "success",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    if (wallet) {
      toaster.create({
        id: "wallet-toast",
        title: `${wallet} Wallet selected`,
        description: "Please generate a wallet to continue.",
        closable: true,
        type: "success",
      });
    }

    window.history.replaceState({}, document.title);
  }, [wallet]);

  return (
    <Box p={6}>
      <Stack>
        {!secretPhrase && (
          <>
            <Text fontSize={[20, 30, 40, 50]} fontWeight="bold">
              Secret Recovery Phrase
            </Text>
            <Text
              fontSize={[5, 10, 20, 25]}
              mt="-4"
              color="#bbbbbbff"
              fontWeight="medium"
              ml="0.5"
            >
              Save these words in a safe place.
            </Text>
            <HStack maxW="100%">
              <Input
                ref={phraseRef}
                placeholder="Enter your secret phrase (or leave blank to generate)"
                variant="outline"
                color="white"
                type="text"
                fontFamily="monospace"
                rounded="lg"
              />
              <Button
                bg="white"
                variant="outline"
                color="black"
                fontWeight="light"
                rounded="lg"
                onClick={generateSecretPhrase}
                _hover={{ bg: "#ffffffd8" }}
              >
                Generate Wallet
              </Button>
            </HStack>
          </>
        )}
        {secretPhrase && (
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
                  <MotionStack
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
                          {secretPhrase.split(" ").map((word, index) => (
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
                  </MotionStack>
                )}
              </Box>
            </AccordionItem>
          </AccordionRoot>
        )}
      </Stack>
      <Toaster />
    </Box>
  );
};

export default Solana;
