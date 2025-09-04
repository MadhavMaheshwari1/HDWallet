"use client";
import { SiEthereum } from "react-icons/si";
import { Box, Text, Switch, HStack } from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { chakra } from "@chakra-ui/react";
import Link from "next/link";
import { useColorMode, useColorModeValue } from "@/components/ui/color-mode";

const ChakraNextLink = chakra(Link);

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const themeColor = useColorModeValue("light", "dark");

  return (
    <HStack justify={"space-between"} w={"100%"} p={4}>
      <HStack align="center">
        <Box
          w="fit-content"
          h="70px"
          bg=""
          display="flex"
          alignItems="center"
          justifyContent="start"
          gap={1}
        >
          <SiEthereum size={30} color={themeColor} />
          <ChakraNextLink
            href="/"
            fontWeight="bold"
            mt="0"
            fontSize={["2xl", "2xl", "3xl", "3xl"]}
          >
            Nidhi
          </ChakraNextLink>
        </Box>
        <Box
          rounded="4xl"
          border={
            themeColor === "light"
              ? "1px solid rgba(0, 0, 0, 0.28)"
              : "1px solid rgba(255, 255, 255, 0.46)"
          }
          bg={
            themeColor === "light"
              ? "rgba(1, 1, 1, 0.12)"
              : "rgba(178, 177, 177, 0.16)"
          }
          px="2"
          height="30px"
          ml="1"
        >
          <Text fontSize="md" fontWeight="bold" color={themeColor} py={0.5}>
            v1.3
          </Text>
        </Box>
      </HStack>
      <HStack justify="space-evenly" align="center" mt="-1">
        <HStack>
          <Sun color={colorMode === "dark" ? "gray" : "black"} size={26} />
          <Switch.Root
            size="md"
            checked={colorMode === "dark"}
            onCheckedChange={toggleColorMode}
            colorScheme="teal"
          >
            <Switch.HiddenInput />
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <Switch.Label />
          </Switch.Root>
        </HStack>
        <Box mt="-0.5" ml="-2">
          <Moon color={colorMode === "dark" ? "white" : "gray"} size={22} />
        </Box>
      </HStack>
    </HStack>
  );
};

export default Navbar;