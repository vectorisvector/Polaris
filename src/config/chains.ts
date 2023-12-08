import { defineChain } from "viem";
import {
  arbitrum,
  avalanche,
  base,
  bsc,
  celo,
  classic,
  confluxESpace,
  fantom,
  gnosis,
  linea,
  mainnet,
  okc,
  opBNB,
  optimism,
  polygon,
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

export const inscriptionChains = {
  eth: mainnet,
  bsc,
  polygon,
  avalanche,
  optimism,
  classic,
  base,
  arbitrum,
  zkSync,
  linea,
  okc,
  fantom,
  opBNB,
  celo,
  confluxESpace,
  gnosis,
  shibarium,
};

export type ChainKey = keyof typeof inscriptionChains;
