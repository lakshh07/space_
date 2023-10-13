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
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Image from "next/image";
import React, { useState } from "react";
import { VscUnverified, VscVerifiedFilled } from "react-icons/vsc";
import { FcGoogle } from "react-icons/fc";
import truncateMiddle from "truncate-middle";
import { QRCodeModal } from "@/components/QRCodeModal";

export const ProfileClient = () => {
  const [verified, setVerified] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
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
                src={`/assets/user.png`}
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
                  Lakshay Maini
                </Heading>
                <Text color={"gray"} fontWeight={500} fontSize={"15px"}>
                  {"@"}
                  {truncateMiddle(
                    "0xc632F549D5107C32B9FF47937DAB11008b1e2636" || "",
                    6,
                    5,
                    "..."
                  )}
                </Text>

                <Divider my={"2rem"} w={"70%"} />

                <Box color={"blackAlpha.700"}>
                  <Flex alignItems={"center"}>
                    <Text ml={"5px"} fontSize={"16px"} fontWeight={500}>
                      20 XP
                    </Text>
                  </Flex>
                  <Flex mt={"0.5rem"} alignItems={"center"}>
                    <FcGoogle fontSize={"20px"} />
                    <Text ml={"8px"} fontSize={"16px"} fontWeight={500}>
                      lakshk886@gmail.com
                    </Text>
                  </Flex>
                  <Flex mt={"0.5rem"} alignItems={"center"}>
                    {verified ? (
                      <VscVerifiedFilled fontSize={"20px"} color={"#1C9BEF"} />
                    ) : (
                      <VscUnverified fontSize={"20px"} />
                    )}
                    <Text ml={"8px"} fontSize={"16px"} fontWeight={500}>
                      PolygonID
                    </Text>

                    {!verified ? (
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
                    <QRCodeModal isOpen={isOpen} onClose={onClose} />
                  </Flex>
                </Box>
              </Flex>
            </Box>
          </GridItem>
          <GridItem>
            <Tabs variant={"soft-rounded"} colorScheme="pink">
              <TabList>
                <Tab fontWeight="600" _focus={{ border: "none" }}>
                  {/* <BiEditAlt style={{ marginRight: "7px", fontWeight: "600" }} /> */}
                  Quests
                </Tab>
                <Tab fontWeight="600" _focus={{ border: "none" }} mx={"10px"}>
                  {/* <TbMessages style={{ marginRight: "7px", fontWeight: "600" }} /> */}
                  Campaigns
                </Tab>
              </TabList>

              <TabPanels mt={"2em"}>
                <TabPanel></TabPanel>
              </TabPanels>
            </Tabs>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
};
