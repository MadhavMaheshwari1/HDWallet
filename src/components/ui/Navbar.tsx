import { SiEthereum } from "react-icons/si";
import { Box, Text, Switch, HStack } from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {useColorMode,useColorModeValue} from "@/components/ui/color-mode";

const Navbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const themeColor = useColorModeValue("light", "dark");

  return (
    <HStack justify={"space-between"} w={"100%"} p={4}>
      <HStack align="center">
        <Box
          w="fit-content"
          h="100px"
          bg=""
          display="flex"
          alignItems="center"
          justifyContent="start"
          gap={1}
        >
          <SiEthereum size={40} color={themeColor} />
          <ChakraLink
            as={RouterLink}
            to="/"
            fontWeight="bold"
            mt="-1"
            fontSize={["2xl", "2xl", "3xl", "4xl"]}
          >
            Nidhi
          </ChakraLink>
        </Box>
        <Box
          rounded="4xl"
          border={
            themeColor === "light"
              ? "2px solid rgba(0, 0, 0, 0.28)"
              : "2px solid rgba(255, 255, 255, 0.27)"
          }
          bg={
            themeColor === "light"
              ? "rgba(1, 1, 1, 0.12)"
              : "rgba(178, 177, 177, 0.16)"
          }
          px="2"
          height="30px"
          m="3"
          mt="3"
        >
          <Text fontSize="lg" fontWeight="bold" color={themeColor}>
            v1.3
          </Text>
        </Box>
      </HStack>
      <HStack justify="space-evenly" align="center" mt="-1">
        <HStack>
          <Sun color={colorMode === "dark" ? "gray" : "black"} size={32} />
          <Switch.Root
            size="lg"
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
          <Moon color={colorMode === "dark" ? "white" : "gray"} size={28} />
        </Box>
      </HStack>
    </HStack>
  );
};

export default Navbar;
