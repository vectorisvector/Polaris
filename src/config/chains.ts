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
  polygon,
  zkSync,
} from "viem/chains";

export const inscriptionChains = {
  eth: mainnet,
  bsc,
  polygon,
  avalanche,
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
};

export type ChainKey = keyof typeof inscriptionChains;
