import { HStack, Link, Text } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";

const Footer = () => {
  const themeColor = useColorModeValue("light", "dark");

  return (
    <HStack
      px={7}
      py={10}
      align="center"
      fontSize={["sm", "lg", "xl", "xl"]}
      justify="start"
      borderTop={
        themeColor === "dark" ? "1px solid #333334d1" : "1px solid #d5d5d5d1"
      }
    >
      <Text fontSize={["sm", "lg", "xl", "xl"]}>
        Designed by <Link
          href="https://www.kshv.me/"
          target="_blank"
          rel="noopener noreferrer"
          fontWeight="bold"
        >
          Keshav
        </Link>
        , Cloned By{" "}
        <Link
          href="https://github.com/MadhavMaheshwari1"
          target="_blank"
          rel="noopener noreferrer"
          fontWeight="bold"
        >
          Madhav
        </Link>
        .
      </Text>
    </HStack>
  );
};

export default Footer;
