"use client";

import { Provider } from "../components/ui/provider";
import { Flex, Spacer } from "@chakra-ui/react";
import Navbar from "../components/ui/Navbar";
import Footer from "../components/ui/Footer";

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