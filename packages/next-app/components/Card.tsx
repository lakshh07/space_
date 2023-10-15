"use client";

import { fetchIpfsCid } from "@/app/hooks/useWeb3StorageClient";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Skeleton,
  SkeletonText,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { QuestModal } from "./quest/QuestModal";

export type questMetadataType = {
  title: string;
  description: string;
  duration: string;
  details: string;
  amount: number;
  xp: number;
};
interface CardProps {
  id: number;
  creator: string;
  interestedUser: string;
  assignedUser: string;
  amount: number;
  status: boolean;
  metadata: string;
}

export const Card: React.FC<CardProps> = ({
  id,
  creator,
  interestedUser,
  assignedUser,
  amount,
  status,
  metadata,
}) => {
  const [data, setData] = useState<questMetadataType>();
  const { isOpen, onClose, onOpen } = useDisclosure();

  const getMetadata = async () => {
    const metaData = await fetchIpfsCid(metadata);
    setData(metaData);
  };

  useEffect(() => {
    getMetadata();
  }, []);

  const interestedUserArray: string[] = interestedUser.split(",");

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
      onClick={onOpen}
    >
      <Flex
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        p={"0.9em 1.1em"}
      >
        <Box w={"100%"}>
          {data ? (
            <Heading fontSize={"26px"} fontWeight={600} color={"black"}>
              {data?.title}
            </Heading>
          ) : (
            <Skeleton height="20px" w={"30%"} />
          )}

          {data ? (
            <Text my={"0.5"} color={"blackAlpha.600"}>
              Duration: &nbsp;{data?.duration}
            </Text>
          ) : (
            <Skeleton my={"1rem"} height={"16px"} w={"16%"} />
          )}

          {data ? (
            <Text mt={"1rem"} color={"blackAlpha.800"} w={"80%"}>
              {data?.description}
            </Text>
          ) : (
            <SkeletonText />
          )}
        </Box>

        <Flex alignItems={"center"}>
          {data ? (
            <Badge
              colorScheme="pink"
              fontSize="0.8em"
              border={"1px solid black"}
              borderRadius={"0.425rem"}
            >
              {`${ethers.utils.formatEther(data?.amount)} MATIC`}
            </Badge>
          ) : (
            <Skeleton height={"16px"} w={"50px"} />
          )}

          {data ? (
            <Badge
              colorScheme={"purple"}
              fontSize="0.8em"
              border={"1px solid black"}
              mx={"1em"}
              borderRadius={"0.425rem"}
            >
              {`${data?.xp} XP`}
            </Badge>
          ) : (
            <Skeleton mx={"1rem"} height={"16px"} w={"50px"} />
          )}

          {data ? (
            <Badge
              colorScheme={status ? "green" : "orange"}
              fontSize="0.8em"
              border={"1px solid black"}
              borderRadius={"0.425rem"}
            >
              {status ? "Completed" : "Ongoing"}
            </Badge>
          ) : (
            <Skeleton height={"16px"} w={"50px"} />
          )}
        </Flex>
      </Flex>

      <QuestModal
        isOpen={isOpen}
        onClose={onClose}
        id={id}
        creator={creator}
        status={status}
        metadata={data}
        assignedUser={assignedUser}
        interestedUserArray={interestedUserArray}
      />
    </Box>
  );
};
