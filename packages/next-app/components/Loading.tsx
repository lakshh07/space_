"use client";

import { useLoadingContext } from "@/context/loading";
import { Box, Flex, Heading, Spinner } from "@chakra-ui/react";
import React from "react";

export const Loading: React.FC = () => {
  const { mainLoading } = useLoadingContext();
  return (
    <>
      {mainLoading && (
        <Box
          position={"absolute"}
          h={"100%"}
          w={"100%"}
          bg={"rgba(245, 245, 245,0.65)"}
          backdropFilter={"blur(15px)"}
          zIndex={"99"}
        >
          <Flex
            justifyContent={"flex-start"}
            alignItems={"center"}
            h={"100%"}
            w={"100%"}
            flexDirection={"column"}
            top={"30%"}
            position={"relative"}
          >
            <Spinner size={"sm"} />
            <Heading
              fontSize={"20px"}
              fontWeight={500}
              mt={"22px"}
              filter={"drop-shadow(0px 5px 3px rgba(245, 245, 245, 0.2))"}
            >
              the best things in life are worth the wait
            </Heading>
          </Flex>
        </Box>
      )}
    </>
  );
};
