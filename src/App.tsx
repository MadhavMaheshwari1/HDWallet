import { Flex, Spacer } from "@chakra-ui/react";
import Navbar from "./components/ui/Navbar";
import HeroPage from "./Pages/HeroPage";
import Footer from "./components/ui/Footer";
import { motion } from "framer-motion";
import { Routes, Route } from "react-router-dom";
import Solana from "./Pages/Solana";
import Ethereum from "./Pages/Ethereum";

const App = () => (
  <Flex direction="column" height="100vh" maxW="1920px" mx="auto">
    <Navbar />
    <Routes>
      <Route path="/" element={<HeroPage />} />
      <Route path="/solana" element={<Solana />} />
      <Route path="/ethereum" element={<Ethereum />} />
    </Routes>
    <Spacer />
    <Footer />
  </Flex>
);

export default App;
