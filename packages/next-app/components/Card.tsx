"use client";

import { Badge, Box, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface CardProps {
  title: string;
  duration: string;
  description: string;
  amount: number;
  points: number;
  status: number;
}

export const Card: React.FC<CardProps> = ({
  title,
  description,
  duration,
  amount,
  points,
  status,
}) => {
  return (
    <Box
      mt={"1rem"}
      borderWidth={"2px"}
      borderColor={"rgb(10 10 10/1)"}
      borderRadius={"0.425rem"}
      overflow={"hidden"}
      cursor={"pointer"}
      transform={"scale(1)"}
      transition={"transform 0.3s "}
      _hover={{
        backgroundColor: "rgb(248,248,248)",
        transform: "scale(1.012)",
        transition: "transform 0.3s ",
      }}
    >
      <Flex
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        p={"0.9em 1.1em"}
      >
        <Box>
          <Heading fontSize={"26px"} fontWeight={600} color={"black"}>
            {title}
          </Heading>
          <Text my={"0.5"} color={"blackAlpha.600"}>
            Duration: {duration}
          </Text>

          <Text mt={"2"} color={"blackAlpha.800"}>
            {description}
          </Text>
        </Box>

        <Flex alignItems={"center"}>
          <Badge
            colorScheme="pink"
            fontSize="0.8em"
            border={"1px solid black"}
            borderRadius={"0.425rem"}
          >
            {amount} MATIC
          </Badge>
          <Badge
            colorScheme={"purple"}
            fontSize="0.8em"
            border={"1px solid black"}
            mx={"1em"}
            borderRadius={"0.425rem"}
          >
            +{points} XP
          </Badge>
          <Badge
            colorScheme={status === 1 ? "green" : "orange"}
            fontSize="0.8em"
            border={"1px solid black"}
            borderRadius={"0.425rem"}
          >
            {status === 1 ? "Completed" : "Ongoing"}
          </Badge>
        </Flex>
      </Flex>
    </Box>
  );
};
