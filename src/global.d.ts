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