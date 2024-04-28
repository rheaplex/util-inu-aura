'use client';

import { http, createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { defineChain } from 'viem';

export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
  },
});


export const config = createConfig({
  chains: [mainnet, sepolia, anvil],
  connectors: [
    injected(),
  ],
  ssr: true,
  transports: {
    [anvil.id]: http(),
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});
