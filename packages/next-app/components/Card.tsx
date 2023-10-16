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
import { useRouter } from "next/navigation";
import { BiSolidRightArrow } from "react-icons/bi";
import moment from "moment";
import { useLoadingContext } from "@/context/loading";

export type MetadataType = {
  title: string;
  description: string;
  duration?: string;
  details?: string;
  amount: number;
  xp: number;
  startDate?: string;
  endDate?: string;
};
interface CardProps {
  id?: string;
  index: number;
  creator: string;
  interestedUser?: string;
  assignedUser?: string;
  amount: number;
  status: boolean;
  metadata: string;
  isCampaign?: boolean;
}

export const Card: React.FC<CardProps> = ({
  id,
  index,
  creator,
  interestedUser,
  assignedUser,
  amount,
  status,
  metadata,
  isCampaign,
}) => {
  const [data, setData] = useState<MetadataType>();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const router = useRouter();
  const { setMainLoading } = useLoadingContext();

  const getMetadata = async () => {
    const metaData = await fetchIpfsCid(metadata);
    setData(metaData);
  };

  useEffect(() => {
    getMetadata();
  }, []);

  const interestedUserArray: string[] | undefined = interestedUser?.split(",");

  return (
    <Flex
      position={"relative"}
      mt={"1rem"}
      borderWidth={"2px"}
      borderColor={"rgb(10 10 10/1)"}
      borderRadius={"0.425rem"}
      overflow={"hidden"}
      cursor={"pointer"}
      transform={"scale(1)"}
      transition={"transform 0.3s "}
      _hover={{
        transform: "scale(1.012)",
        transition: "transform 0.3s ",
      }}
      onClick={() => {
        if (isCampaign) {
          setMainLoading(true);
          router.push(`/campaigns/${id}`);
        } else {
          onOpen();
        }
      }}
    >
      <Flex
        alignItems={"flex-start"}
        justifyContent={"space-between"}
        p={"0.9em 1.1em"}
        w={"100%"}
        transition={"all 0.2s"}
        bg={"white"}
        _hover={{
          backgroundColor: "rgb(248,248,248)",
          transform: "translateX(-2.5em)",
          transition: "all ease-in-out 0.2s",
          borderRight: "2px solid black",
        }}
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
              Duration: &nbsp;
              {isCampaign
                ? `${moment(data?.startDate).format("MMM Do YYYY")} - ${moment(
                    data?.endDate
                  ).format("MMM Do YYYY")}`
                : data?.duration}
            </Text>
          ) : (
            <Skeleton my={"1rem"} height={"16px"} w={"16%"} />
          )}

          {data ? (
            <Text mt={"1rem"} color={"blackAlpha.800"} w={"100%"}>
              {data?.description.substring(0, 160)}
              {data?.description.length > 150 && `...`}
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
              {isCampaign && "Goal: "}
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

      <Flex
        position={"absolute"}
        w={"100%"}
        pr={"12px"}
        bg={"pink"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        h={"100%"}
        borderLeft={"1px solid black"}
        zIndex={"-1"}
      >
        <BiSolidRightArrow />
      </Flex>

      {!isCampaign && (
        <QuestModal
          isOpen={isOpen}
          onClose={onClose}
          id={index}
          creator={creator}
          status={status}
          metadata={data}
          assignedUser={assignedUser}
          interestedUserArray={interestedUserArray}
        />
      )}
    </Flex>
  );
};
