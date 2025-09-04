"use client";

import { redirect } from "next/navigation";
import WalletPage from "../wallet/page";
import React from "react";

const allowedWallets = ["solana", "ethereum"];

export default function WalletTypePage({ params }: { params: Promise<{ walletType: string }> }) {
  const { walletType } = React.use(params);

  if (!allowedWallets.includes(walletType)) {
    redirect("/");
  }
  return <WalletPage />;
}