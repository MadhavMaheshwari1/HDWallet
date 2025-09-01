import { Flex, Spacer } from "@chakra-ui/react";
import Navbar from "./components/ui/Navbar";
import HeroPage from "./Pages/HeroPage";
import Footer from "./components/ui/Footer";
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import WalletPage from "./Pages/WalletPage";

const allowedWallets: string[] = ["solana", "ethereum"];

const App = () => (
  <Flex direction="column" height="100vh" maxW="1920px" mx="auto">
    <Navbar />
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/:walletType" element={<WalletRoutes />} />
      <Route path="*" element={<HeroPage />}></Route>
    </Routes>
    <Spacer />
    <Footer />
  </Flex>
);

const WalletRoutes = () => {
  const { walletType } = useParams();
  console.log(walletType)
  if (walletType && allowedWallets.includes(walletType)) {
    return <WalletPage />;
  }
  return <Navigate to="/" />;
};

export default App;
