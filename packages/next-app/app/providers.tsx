"use client";

import LoadingContext from "@/context/loading";
import { ToasterProvider } from "@/providers/ToasterProvider";
import SmartAccountContext from "@/context/userAccount";
import { chains, wagmiConfig } from "@/utils/rainbowConfig";
import { BiconomySmartAccountV2 } from "@biconomy/account";
import { CacheProvider } from "@chakra-ui/next-js";
import { ChakraProvider } from "@chakra-ui/react";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { useState } from "react";
import { WagmiConfig } from "wagmi";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mainLoading, setMainLoading] = useState<boolean>(true);
  const [smartAccount, setSmartAccount] = useState<BiconomySmartAccountV2>();

  return (
    <CacheProvider>
      <ChakraProvider>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            modalSize="compact"
            coolMode
            chains={chains}
            appInfo={{
              appName: "Space_",
            }}
          >
            <LoadingContext.Provider value={{ mainLoading, setMainLoading }}>
              <SmartAccountContext.Provider
                value={{ smartAccount, setSmartAccount }}
              >
                <ToasterProvider />
                {children}
              </SmartAccountContext.Provider>
            </LoadingContext.Provider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ChakraProvider>
    </CacheProvider>
  );
}
