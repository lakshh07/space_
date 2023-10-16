"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Gabarito } from "next/font/google";
import Image from "next/image";
import { contract } from "@/app/hooks/useAccountAbstraction";
import toast from "react-hot-toast";
import { useWaitForTransaction } from "wagmi";
import { fetchIpfsCid } from "@/app/hooks/useWeb3StorageClient";
import { MetadataType } from "@/components/Card";
import { ethers } from "ethers";
import moment from "moment";
import { useLoadingContext } from "@/context/loading";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { usePathname } from "next/navigation";

interface CampaignPageClientProps {
  campaignId: string;
}

const gabarito = Gabarito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const sampleData = {
  id: "adcadc-sc-s-a-cacdcd-ad",
  creator: "0xc632F549D5107C32B9FF47937DAB11008b1e2636",
  metadata: "bafybeicpc5f32gkmc6f4c6i4i6nqykpbbj7vr3qgbxyaalkhcf6p57bika",
  amount: 700000000000000,
  donatedAmount: "8000000000000000000",
  totalDonors: 12,
  status: false,
  xp: 5,
};

export const CampaignPageClient: React.FC<CampaignPageClientProps> = ({
  campaignId,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<MetadataType>();
  const [percentage, setPercentage] = useState<number>(0);
  const [completeQuestTxnData, setCompleteQuestTxnData] = useState<any>({
    id: "",
    hash: "",
    isSuccess: false,
  });
  const { setMainLoading } = useLoadingContext();
  const pathname = usePathname();

  const getMetadata = async (metadata: string) => {
    const metaData = await fetchIpfsCid(metadata);
    setData(metaData);
  };

  useEffect(() => {
    setMainLoading(false);
  }, [data]);

  useEffect(() => {
    if (data) {
      setPercentage(
        (parseFloat(sampleData?.donatedAmount) / data?.amount) * 100
      );
    }
  }, [sampleData.donatedAmount, data]);

  useEffect(() => {
    getMetadata(sampleData.metadata);
  }, []);

  const fundDonation = async () => {
    const toastId = toast.loading("Transaction logging...");
    setLoading(true);
    setDisabled(true);

    const transaction = await contract.questComplete();

    setCompleteQuestTxnData({
      id: toastId,
      hash: transaction?.hash,
      isSuccess: false,
    });
  };

  useEffect(() => {
    if (completeQuestTxnData.isSuccess) {
      setLoading(false);
      setDisabled(false);
      toast.success("Transaction Successfull", {
        id: completeQuestTxnData?.id,
      });
    }

    if (completeQuestTxnData.hash) {
      const { isSuccess } = useWaitForTransaction({
        hash: completeQuestTxnData?.hash,
      });

      setCompleteQuestTxnData({
        ...completeQuestTxnData,
        isSuccess: isSuccess,
      });
    }
  }, [completeQuestTxnData.hash, completeQuestTxnData.isSuccess]);

  return (
    <Box
      w={"100%"}
      h={"100%"}
      backgroundImage={"/assets/bg-pattern.png"}
      backgroundPosition={"center"}
      backgroundSize={"cover"}
    >
      <Container py={"2.5rem"} maxW={"1200px"}>
        <Center>
          <Stack spacing={"3em"}>
            <Box>
              <Heading
                fontSize={"3.7rem"}
                lineHeight={"2.5rem"}
                fontWeight={700}
                mt={"1em"}
                textTransform={"capitalize"}
                letterSpacing={"2px"}
                className={gabarito.className}
              >
                {data?.title}
              </Heading>

              <Flex
                mt={"0.5em"}
                className={gabarito.className}
                color={"blackAlpha.700"}
                fontSize={"14px"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Text>Created by: {sampleData.creator}</Text>
                <Text>+🔥{data?.xp}XP</Text>
              </Flex>
            </Box>

            <Container
              maxW="750px"
              centerContent
              mt={"-0.5em"}
              overflow={"scroll"}
              maxH={"100px"}
              minH={"90px"}
            >
              <Text textAlign={"center"}>{data?.description}</Text>
            </Container>

            <Flex
              justifyContent={"space-around"}
              alignItems={"center"}
              className={gabarito.className}
              mt={"1em"}
            >
              <Flex
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Text fontSize={"26px"}>{sampleData.totalDonors}</Text>
                <Text fontSize={"28px"} fontWeight={600} mt={"-7px"}>
                  Backers
                </Text>
              </Flex>
              <Flex
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Flex gap={"7px"} alignItems={"center"}>
                  <Image
                    src={"/assets/polygon-matic-logo.svg"}
                    height={25}
                    width={25}
                    alt={"matic"}
                  />
                  <Text fontSize={"26px"}>
                    {data && ethers.utils.formatEther(sampleData.donatedAmount)}
                  </Text>
                </Flex>
                <Text fontSize={"28px"} fontWeight={600} mt={"-7px"}>
                  Funded
                </Text>
              </Flex>
              <Flex
                flexDir={"column"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <Text fontSize={"26px"}>
                  {moment(data?.startDate).toNow(true).substring(0, 2) == "an"
                    ? "0"
                    : moment(data?.endDate).toNow(true).substring(0, 2)}
                </Text>
                <Text
                  fontSize={"28px"}
                  fontWeight={600}
                  mt={"-7px"}
                  textTransform={"capitalize"}
                >
                  {moment(data?.endDate).toNow().substring(2)}
                </Text>
              </Flex>
            </Flex>

            <Box className={gabarito.className}>
              <Progress
                hasStripe
                colorScheme={"purple"}
                value={percentage}
                isAnimated
                rounded={"full"}
              />
              <Flex
                justifyContent={"space-between"}
                alignItems={"center"}
                fontSize={"18px"}
              >
                <Flex gap={"7px"} alignItems={"center"}>
                  <Image
                    src={"/assets/polygon-matic-logo.svg"}
                    height={20}
                    width={20}
                    alt={"matic"}
                  />
                  <Text>
                    {data && ethers.utils.formatEther(data?.amount)} Goal
                  </Text>
                </Flex>
                <Text>{percentage}%</Text>
              </Flex>
            </Box>

            <Flex
              justifyContent={"center"}
              alignItems={"center"}
              className={gabarito.className}
              gap={"5em"}
              mt={"1em"}
              pb={"5em"}
            >
              <Button
                colorScheme="purple"
                rounded={"15px"}
                size={"lg"}
                isLoading={loading}
                onClick={fundDonation}
              >
                Fund
              </Button>
              <CopyToClipboard
                text={`${process.env.NEXT_PUBLIC_FRONTEND_URL}${pathname}`}
                onCopy={() => {
                  toast.success("Link copied!");
                }}
              >
                <Button
                  colorScheme="purple"
                  variant={"outline"}
                  rounded={"15px"}
                  size={"lg"}
                >
                  Share
                </Button>
              </CopyToClipboard>
            </Flex>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
};
