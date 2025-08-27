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
      <Text fontSize={["3xl", "4xl", "4xl", "5xl"]} fontWeight="bold">
        Nidhi supports multiple blockchains
      </Text>
      <Text
        fontSize={["xl", "xl", "2xl", "2xl"]}
        fontWeight="semibold"
        color={themeColor}
        mt="-2"
      >
        Choose a blockchain to get started.
      </Text>

      <HStack mt={[1, 2, 2]}>
        <Link to="/solana" state={{ selectedWallet: "Solana" }}>
          <Button
            w="8"
            fontSize={["sm", "sm", "md", "md"]}
            py={[4, 4, 6, 6]}
            px={[8, 8, 10, 10]}
            rounded="xl"
            fontWeight="thin"
          >
            Solana
          </Button>
        </Link>

        <Link to="/ethereum" state={{ selectedWallet: "Ethereum" }}>
          <Button
            w="8"
            fontSize={["sm", "sm", "md", "md"]}
            py={[4, 4, 6, 6]}
            px={[10, 10, 12, 12]}
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
