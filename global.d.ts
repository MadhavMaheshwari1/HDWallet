export {}; // ensure this is a module

declare global {
interface GlobalThis {
    Buffer: typeof import("buffer").Buffer;
    process: typeof import("process");
  }

  interface Window {
    Buffer: typeof import("buffer").Buffer;
    process: typeof import("process");
  }

  // Wallet types
  interface WalletAccount {
    publicKey: string;
    privateKey: string;
  }

  interface WalletProvider {
    mnemonic: string;
    wallet: WalletAccount[];
  }

  type WalletsMap = Record<string, WalletProvider>;
}
