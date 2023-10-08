"use client";

import { Flex } from "@chakra-ui/react";
import React from "react";
import { PuffLoader } from "react-spinners";

const Loader: React.FC = () => {
  return (
    <Flex
      h={"70vh"}
      justifyContent={"center"}
      alignItems={"center"}
      flexDir={"column"}
    >
      <PuffLoader size={100} color="#7263D6" />
    </Flex>
  );
};

export default Loader;
