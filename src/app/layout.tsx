
import { Provider } from "../components/ui/provider";
import { Flex, Spacer } from "@chakra-ui/react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

// eslint-disable-next-line react-refresh/only-export-components
export const metadata = {
  title: "Nidhi Wallet",
  description: "Your multi-blockchain wallet app",
  icon: "/Ethereum.png",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Flex direction="column" height="100vh" maxW="1920px" mx="auto">
            <Navbar />
            {children}
            <Spacer />
            <Footer />
          </Flex>
        </Provider>
      </body>
    </html>
  );
}
