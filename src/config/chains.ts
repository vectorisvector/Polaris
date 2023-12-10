import { defineChain } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  classic,
  confluxESpace,
  eos,
  fantom,
  filecoin,
  gnosis,
  linea,
  mainnet,
  neonMainnet,
  okc,
  opBNB,
  optimism,
  polygon,
  sepolia,
  zkSync,
} from "viem/chains";

export const shibarium = defineChain({
  id: 109,
  name: "Shibarium",
  network: "shibarium",
  nativeCurrency: {
    decimals: 18,
    name: "BONE",
    symbol: "BONE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.shibrpc.com"],
    },
    public: {
      http: ["https://rpc.shibrpc.com"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://shibariumscan.io" },
  },
});

export const camelark = defineChain({
  id: 20001,
  name: "Camelark Mainnet",
  network: "camelark Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "ETHW",
    symbol: "ETHW",
  },
  rpcUrls: {
    default: {
      http: ["https://mainnet-http-rpc.camelark.com"],
    },
    public: {
      http: ["https://mainnet-http-rpc.camelark.com"],
    },
  },
  blockExplorers: {
    default: { name: "Explorer", url: "https://scan.camelark.com" },
  },
});

export const inscriptionChains = {
  eth: mainnet,
  bsc,
  opBNB,
  okc,
  polygon,
  fantom,
  avalanche,
  arbitrum,
  optimism,
  base,
  zkSync,
  classic,
  camelark,
  eos,
  neonMainnet,
  linea,
  celo,
  confluxESpace,
  gnosis,
  filecoin,
  shibarium,
  sepolia,
};

export type ChainKey = keyof typeof inscriptionChains;
