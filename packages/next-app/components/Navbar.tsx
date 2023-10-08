"use client";

import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const links = ["quests", "campaigns", "profile"];

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
          <ConnectButton />
        </Box>
      </Flex>
    </Box>
  );
};
