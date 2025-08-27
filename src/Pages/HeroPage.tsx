import React from "react";
import { Stack, Text, Button, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useColorModeValue } from "@/components/ui/color-mode";

const MotionStack = motion(Stack);

const HeroPage = () => {
  const themeColor = useColorModeValue("gray.800", "gray.300");

  return (
    <MotionStack
      mt={10}
      px={7}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Text fontSize={["4xl", "6xl", "6xl", "6xl"]} fontWeight="bold">
        Nidhi supports multiple blockchains
      </Text>
      <Text
        fontSize={["2xl", "3xl", "3xl", "3xl"]}
        fontWeight="semibold"
        color={themeColor}
        mt="-2"
      >
        Choose a blockchain to get started.
      </Text>

      <HStack mt={[2, 4, 6]} spacing={[4, 6, 8]}>
        <Link to="/solana" state={{ selectedWallet: "Solana",fromHome:true }}>
          <Button
            w="20"
            fontSize={["sm", "sm", "xl", "xl"]}
            py={[2, 6, 8, 8]}
            px={[2, 10, 14, 20]}
            rounded="xl"
            fontWeight="thin"
          >
            Solana
          </Button>
        </Link>

        <Link to="/ethereum" state={{ selectedWallet: "Ethereum",fromHome:true }}>
          <Button
            w="20"
            fontSize={["sm", "sm", "xl", "xl"]}
            py={[2, 6, 8, 8]}
            px={[2, 10, 14, 20]}
            rounded="xl"
            fontWeight="thin"
          >
            Ethereum
          </Button>
        </Link>
      </HStack>
    </MotionStack>
  );
};

export default HeroPage;
