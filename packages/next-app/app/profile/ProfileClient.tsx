"use client";

import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Tooltip,
  VisuallyHidden,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { VscUnverified, VscVerifiedFilled } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import truncateMiddle from "truncate-middle";
import { QRCodeModal } from "@/components/QRCodeModal";
import { useLoadingContext } from "@/context/loading";
import { useSmartAccountContext } from "@/context/userAccount";
import { particle } from "@/utils/rainbowConfig";
import EmptyState from "@/components/EmptyState";
import { useAccount } from "wagmi";
import { useQuery } from "urql";
import useSubgraph from "@/hooks/useSubgraph";
import toast from "react-hot-toast";
import CopyToClipboard from "react-copy-to-clipboard";
import { questDataType } from "../quests/QuestClient";
import { campaignDataType } from "../campaigns/CampaignsClient";
import { Card } from "@/components/Card";

type UserInfo = {
  name?: string;
  avatar?: string;
  email?: string;
  google_email?: string;
};

type UserDataInfo = {
  quests: questDataType[];
  campaings: campaignDataType[];
  creators: [
    {
      id: string;
      creator: string;
      isVerified: boolean;
      metadata: string;
      totalXP: number;
    }
  ];
  donors: [
    {
      id: string;
      donor: string;
      amount: number;
    }
  ];
};

export const ProfileClient: React.FC = () => {
  const [sAddress, setSAddress] = useState<string>("");
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { setMainLoading } = useLoadingContext();
  const { smartAccount } = useSmartAccountContext();
  const { address } = useAccount();
  const { creatorQuery } = useSubgraph();

  const getSAddress = async () => {
    const smartAddress = await smartAccount?.getAccountAddress();
    const info = particle.auth.getUserInfo();

    info && setUserInfo(info);
    smartAddress && setSAddress(smartAddress);
    setMainLoading(false);
  };

  const [result, reexecuteQuery] = useQuery({
    query: creatorQuery,
    variables: {
      address: address,
    },
  });
  const { data, fetching } = result;
  // console.log(data, fetching);

  useEffect(() => {
    getSAddress();
  }, [smartAccount]);

  if (!address) {
    return <EmptyState title="Unauthorized" subtitle="Please sign in" />;
  }

  return userInfo && sAddress ? (
    <Box>
      <Box
        mt={"1rem"}
        w={"100%"}
        h={"210px"}
        backgroundImage={"/assets/profile-bg.svg"}
        backgroundPosition={"center"}
        backgroundColor="rgba(248, 122, 195, 0.3)"
        // backgroundColor="#7263D6"
        backgroundSize={"cover"}
      ></Box>
      <Container my={"4rem"} maxW={"1200px"}>
        <Grid templateColumns={"2fr 4fr"}>
          <GridItem>
            <Box
              mt={"-6rem"}
              border={"6px solid white"}
              w={"max-content"}
              h={180}
              borderRadius={"10px"}
              bg={"white"}
            >
              <Image
                src={userInfo?.avatar ? userInfo?.avatar : `/assets/user.png`}
                height={170}
                width={170}
                alt={"profile-picture"}
                style={{
                  borderRadius: "5px",
                  backgroundColor: "rgba(248, 122, 195, 0.3)",
                }}
              />
            </Box>

            <Box pl="5px">
              <Flex alignItems={"baseline"} flexDir={"column"}>
                <Heading
                  textTransform={"capitalize"}
                  fontSize={"26px"}
                  fontWeight={700}
                  pt={"1em"}
                >
                  {userInfo?.name}
                </Heading>
                <CopyToClipboard
                  text={sAddress ? sAddress : ""}
                  onCopy={() => {
                    toast.success("Smart Account Address copied!");
                  }}
                >
                  <>
                    <VisuallyHidden>
                      <Text>{sAddress}</Text>
                    </VisuallyHidden>
                    <Tooltip
                      label="Biconomy Smart Account Address"
                      placement="right"
                      bg={"whitesmoke"}
                      color={"black"}
                    >
                      <Text
                        color={"gray"}
                        fontWeight={500}
                        fontSize={"15px"}
                        cursor={"pointer"}
                      >
                        {`@`}
                        {truncateMiddle(sAddress || "", 6, 5, "...")}
                      </Text>
                    </Tooltip>
                  </>
                </CopyToClipboard>

                <Divider my={"2rem"} w={"70%"} />

                <Box color={"blackAlpha.700"}>
                  <Flex alignItems={"center"}>
                    <Text fontSize={"20px"}>🔥</Text>
                    <Text ml={"8px"} fontSize={"16px"} fontWeight={500}>
                      {data?.creators[0]?.totalXP
                        ? data?.creators[0]?.totalXP
                        : 0}
                      XP
                    </Text>
                  </Flex>
                  <Flex mt={"0.5rem"} alignItems={"center"}>
                    <FcGoogle fontSize={"20px"} />
                    <Text ml={"8px"} fontSize={"16px"} fontWeight={500}>
                      {userInfo?.email
                        ? userInfo?.email
                        : userInfo?.google_email}
                    </Text>
                  </Flex>
                  <Flex mt={"0.5rem"} alignItems={"center"}>
                    {data?.creators[0]?.isVerified ? (
                      <VscVerifiedFilled fontSize={"20px"} color={"#1C9BEF"} />
                    ) : (
                      <VscUnverified fontSize={"20px"} />
                    )}
                    <Text ml={"8px"} fontSize={"16px"} fontWeight={500}>
                      PolygonID
                    </Text>

                    {!data?.creators[0]?.isVerified ? (
                      <Button
                        ml={"0.5rem"}
                        bg={"#7263D6"}
                        color={"white"}
                        size={"xs"}
                        _hover={{
                          bg: "#7263D6",
                          transform: "scale(1.025)",
                        }}
                        onClick={onOpen}
                      >
                        Verify
                      </Button>
                    ) : null}
                    {isOpen && (
                      <QRCodeModal
                        isOpen={isOpen}
                        onClose={onClose}
                        address={address}
                      />
                    )}
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </GridItem>
          <GridItem>
            <Tabs variant={"soft-rounded"} colorScheme="pink">
              <TabList>
                <Tab fontWeight="600" _focus={{ border: "none" }}>
                  Quests
                </Tab>
                <Tab fontWeight="600" _focus={{ border: "none" }} mx={"10px"}>
                  Campaigns
                </Tab>
              </TabList>

              <TabPanels mt={"1em"}>
                <TabPanel>
                  {!data?.quests?.length && (
                    <Flex justifyContent={"center"} mt={"10em"}>
                      <Text>No data available</Text>
                    </Flex>
                  )}
                  {data?.quests?.map((list: questDataType, index: number) => {
                    return (
                      <Box pointerEvents={"none"} key={index}>
                        <Card
                          index={index}
                          creator={list.creator}
                          amount={list.amount}
                          status={list.status}
                          interestedUser={list.interestedUsers}
                          assignedUser={list.assigned}
                          metadata={list.metadata}
                          reexecuteQuery={reexecuteQuery}
                        />
                      </Box>
                    );
                  })}
                </TabPanel>

                <TabPanel>
                  {!data?.campaigns?.length && (
                    <Flex justifyContent={"center"} mt={"10em"}>
                      <Text>No data available</Text>
                    </Flex>
                  )}
                  {data?.campaigns?.map(
                    (list: campaignDataType, index: number) => {
                      return (
                        <Box pointerEvents={"none"} key={index}>
                          <Card
                            id={list.id}
                            index={index}
                            creator={list.creator}
                            amount={list.amount}
                            status={list.status}
                            metadata={list.metadata}
                            isCampaign={true}
                            reexecuteQuery={reexecuteQuery}
                          />
                        </Box>
                      );
                    }
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  ) : (
    <Flex justifyContent={"center"} mt={"10em"}>
      <Spinner />
    </Flex>
  );
};
