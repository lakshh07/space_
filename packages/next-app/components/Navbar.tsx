"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWalletClient, usePublicClient } from "wagmi";
import useAAHooks from "@/app/hooks/useAAHooks";
import {
  ECDSAOwnershipValidationModule,
  DEFAULT_ECDSA_OWNERSHIP_MODULE,
} from "@biconomy/modules";
import {
  BiconomySmartAccountV2,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { useSmartAccountContext } from "@/context/userAccount";
import { ethersProvider } from "@/utils/rainbowConfig";
import toast from "react-hot-toast";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const links = ["quests", "campaigns", "profile"];
  const { paymaster, bundler, ChainId } = useAAHooks();
  const { setSmartAccount } = useSmartAccountContext();

  const createSmartAccount = async () => {
    try {
      toast.loading("Creating Smart Account...", {
        duration: 2500,
      });
      const ethersSigner = ethersProvider.getSigner();
      const module = await ECDSAOwnershipValidationModule.create({
        signer: ethersSigner,
        moduleAddress: DEFAULT_ECDSA_OWNERSHIP_MODULE,
      });
      let biconomySmartAccount = await BiconomySmartAccountV2.create({
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
        entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
        defaultValidationModule: module,
        activeValidationModule: module,
      });
      const smartAccountAddress =
        await biconomySmartAccount.getAccountAddress();
      setSmartAccount(biconomySmartAccount);
      toast.success("Smart Account successfully created!");
    } catch (error: any) {
      toast.error("Something went wrong with Smart Account.");
    }
  };

  useEffect(() => {
    if (walletClient) {
      console.log("Creating Biconomy Smart Account...");
      createSmartAccount();
      console.log("✨Created Biconomy Smart Account...");
    }
  }, [walletClient, publicClient]);

  return (
    <Box minH={"81px"}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        px={"5em"}
        py={"1em"}
      >
        <Heading
          fontSize={"2em"}
          fontWeight={800}
          cursor={"pointer"}
          onClick={() => router.push("/")}
        >
          Space<span style={{ color: "#FF6F03" }}>_</span>
        </Heading>

        {pathname != "/" && (
          <Flex alignItems={"center"} gap={"30px"}>
            {links.map((link, index) => {
              return (
                <Text
                  key={index}
                  fontSize={"1.05rem"}
                  textTransform={"capitalize"}
                  transition="color 0.2s ease"
                  cursor={"pointer"}
                  bg={
                    pathname === `/${link}`
                      ? "rgba(248, 122, 195, 0.3)"
                      : "transparent"
                  }
                  p={"0.4em 0.6em"}
                  borderRadius={"10px"}
                  color={pathname === `/${link}` ? "black" : "blackAlpha.700"}
                  _hover={{
                    color: "blackAlpha.900",
                    transition: "color 0.2s ease",
                  }}
                  fontWeight={pathname === `/${link}` ? 600 : 500}
                  onClick={() => router.push(`/${link}`)}
                >
                  {link}
                </Text>
              );
            })}
          </Flex>
        )}

        <Box>
          <ConnectButton label="Sign in" />
        </Box>
      </Flex>
    </Box>
  );
};
