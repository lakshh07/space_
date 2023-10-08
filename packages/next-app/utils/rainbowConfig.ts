import { getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

export const { chains, publicClient } = configureChains(
  [polygonMumbai],
  [publicProvider()]
);

const projectId = process.env.NEXT_APP_WALLETCONNECT_PROJECT_ID || "projectID";

const { connectors } = getDefaultWallets({
  appName: "Space_",
  projectId: projectId,
  chains,
});

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});
