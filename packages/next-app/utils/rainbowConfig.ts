import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { ParticleNetwork } from "@particle-network/auth";
import { particleWallet } from "@particle-network/rainbowkit-ext";
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { ParticleProvider } from "@particle-network/provider";
import { ethers } from "ethers";

export const particle = new ParticleNetwork({
  projectId: process.env.NEXT_PUBLIC_PARTICLE_PROJECTID as string,
  clientKey: process.env.NEXT_PUBLIC_PARTICLE_CLIENTKEY as string,
  appId: process.env.NEXT_PUBLIC_PARTICLE_APPID as string,
});

const particleProvider = new ParticleProvider(particle.auth);
export const ethersProvider = new ethers.providers.Web3Provider(
  particleProvider,
  "any"
);

export const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const particleWallets = [
  particleWallet({ chains, authType: "google" }),
  particleWallet({ chains, authType: "email" }),
  particleWallet({ chains, authType: "github" }),
  particleWallet({ chains }),
];

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      ...particleWallets,
      // injectedWallet({ chains }),
      // metaMaskWallet({
      //   chains,
      //   projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      // }),
      //     walletConnectWallet({
      //       chains,
      //       projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
      //     }),
    ],
  },
]);

export const wagmiConfig = createConfig({
  autoConnect: false,
  connectors,
  publicClient,
});
