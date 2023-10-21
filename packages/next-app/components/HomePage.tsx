"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect } from "react";
import { Dela_Gothic_One } from "next/font/google";
import { useRouter } from "next/navigation";
import { useLoadingContext } from "@/context/loading";

const delaGothicOne = Dela_Gothic_One({ weight: "400", subsets: ["latin"] });

export const HomePage: React.FC = () => {
  const router = useRouter();
  const { setMainLoading } = useLoadingContext();

  useEffect(() => {
    setMainLoading(false);
  }, []);

  return (
    <Box h={"calc(100vh - 150px)"}>
      <Flex
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        mx={"7em"}
        mt={"3em"}
        position={"relative"}
      >
        <Box position={"relative"} zIndex={10}>
          <Box zIndex={12} position={"relative"}>
            <Image
              style={{ marginLeft: "-12px" }}
              src={"/assets/home-fg-3.png"}
              height={70}
              width={70}
              alt="homepage"
              priority
            />
            <Heading
              fontSize={"4em"}
              fontWeight={700}
              className={delaGothicOne.className}
            >
              New Space
              <br />
              for <span style={{ color: "#F87AC3" }}>Creators.</span>
            </Heading>
            <Text w={"60%"} fontWeight={500} my={"0.5em"} fontSize={"17px"}>
              A social platform to seamlessly introduce Web2 users to Web3,
              without the complexities of crypto for quests or donations.
            </Text>
            <Button
              bg={"#7263D6"}
              color={"white"}
              p={"14px 20px"}
              fontWeight={600}
              fontSize={"16px"}
              rounded={"15px"}
              mt={"1em"}
              _hover={{
                bg: "#7263D6",
                transform: "scale(1.025)",
              }}
              onClick={() => {
                setMainLoading(true);
                router.push("/quests");
              }}
            >
              Get Started
            </Button>
          </Box>

          <Box position={"absolute"} top={"85%"} left={"2%"}>
            <Image
              src={"/assets/home-fg-2.png"}
              height={452}
              width={284}
              alt="homepage"
              priority
            />
          </Box>
        </Box>

        <Box position={"absolute"} right={0}>
          <Image
            src={"/assets/home-fg.png"}
            height={650}
            width={650}
            alt="homepage"
            priority
          />
        </Box>
      </Flex>
    </Box>
  );
};
