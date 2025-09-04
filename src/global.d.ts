export {};
declare global {
  // Extend window globals for browser Buffer + process
  interface Window {
    Buffer: typeof import("buffer").Buffer;
    process: typeof import("process");
  }

  // A single account (inside the wallet array)
  interface WalletAccount {
    publicKey: string;
    privateKey: string;
  }

  // A provider like Solana/Ethereum
  interface WalletProvider {
    mnemonic: string;
    wallet: WalletAccount[];
  }

  // Map of all wallets, flexible keys
  type WalletsMap = Record<string, WalletProvider>;
}
