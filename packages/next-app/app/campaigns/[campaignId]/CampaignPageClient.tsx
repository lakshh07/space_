"use client";

import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Heading,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Progress,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Gabarito } from "next/font/google";
import Image from "next/image";
import { signerContract } from "@/hooks/useAccountAbstraction";
import toast from "react-hot-toast";
import { fetchIpfsCid } from "@/hooks/useWeb3StorageClient";
import { ethers } from "ethers";
import moment from "moment";
import { useLoadingContext } from "@/context/loading";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { usePathname } from "next/navigation";
import { ethersProvider } from "@/utils/rainbowConfig";
import { useQuery } from "urql";
import useSubgraph from "@/hooks/useSubgraph";
import { checkSignIn } from "@/utils/checkSignIn";
import { useAccount } from "wagmi";

interface CampaignPageClientProps {
  campaignId: string;
}

type DataType = {
  id: string;
  creator: string;
  title: string;
  description: string;
  startDate?: string | undefined;
  endDate?: string | undefined;
  totalAmount: number;
  donatedAmount: number;
  totalDonors: number;
  status: boolean;
  xp: number;
};

const gabarito = Gabarito({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

export const CampaignPageClient: React.FC<CampaignPageClientProps> = ({
  campaignId,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [mData, setMetaData] = useState<DataType>();
  const [percentage, setPercentage] = useState<number>(0);
  const [fundAmount, setFundAmount] = useState<number>(0.0);
  const { setMainLoading } = useLoadingContext();
  const pathname = usePathname();
  const { address } = useAccount();

  const { campaignQueryById } = useSubgraph();
  function onChange(e: any) {
    setFundAmount(() => e.target.value);
  }

  const [result, reexecuteQuery] = useQuery({
    query: campaignQueryById,
    variables: { id: campaignId },
  });
  const { data, fetching } = result;

  const getData = async () => {
    if (data) {
      const metaData = await fetchIpfsCid(data.campaigns[0].metadata);
      setMetaData({ ...data.campaigns[0], ...metaData });
    }
  };

  useEffect(() => {
    getData();
  }, [data]);

  useEffect(() => {
    if (mData) {
      setPercentage((mData.donatedAmount / mData.totalAmount) * 100);
      setMainLoading(false);
    }
  }, [mData?.donatedAmount, mData]);

  const fundDonation = async () => {
    const toastId = toast.loading("Transaction logging...");
    setLoading(true);
    setDisabled(true);

    const transaction = await signerContract.donateToCampaign(1, {
      value: ethers.utils.parseEther(fundAmount.toString()),
    });

    ethersProvider
      .waitForTransaction(transaction?.hash)
      .then((receipt) => {
        console.log(receipt);
        if (receipt.status == 1) {
          setLoading(false);
          setDisabled(false);
          setFundAmount(0.0);
          toast.success("Transaction Successfull", { id: toastId });
          setTimeout(() => {
            reexecuteQuery({ requestPolicy: "network-only" });
          }, 3000);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
          {fetching ? (
            <Flex h={"80vh"} justifyContent={"center"} alignItems={"center"}>
              <Spinner />
            </Flex>
          ) : (
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
                  {mData?.title}
                </Heading>

                <Flex
                  mt={"0.5em"}
                  className={gabarito.className}
                  color={"blackAlpha.700"}
                  fontSize={"14px"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Text>Created by: {mData?.creator}</Text>
                  <Text>+🔥{mData?.xp}XP</Text>
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
                <Text textAlign={"center"}>{mData?.description}</Text>
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
                  <Text fontSize={"26px"}>{mData?.totalDonors}</Text>
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
                      {mData && ethers.utils.formatEther(mData?.donatedAmount)}
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
                    {moment(mData?.startDate)
                      .toNow(true)
                      .substring(0, 2) == "an"
                      ? "0"
                      : moment(mData?.endDate)
                          .toNow(true)
                          .substring(0, 2)}
                  </Text>
                  <Text
                    fontSize={"28px"}
                    fontWeight={600}
                    mt={"-7px"}
                    textTransform={"capitalize"}
                  >
                    {moment(mData?.endDate)
                      .toNow()
                      .substring(2)}
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
                      {mData && ethers.utils.formatEther(mData?.totalAmount)}{" "}
                      Goal
                    </Text>
                  </Flex>
                  <Text>{percentage}%</Text>
                </Flex>
              </Box>

              <Flex
                justifyContent={"center"}
                alignItems={"center"}
                className={gabarito.className}
                gap={"2em"}
                mt={"1em"}
                pb={"5em"}
              >
                <Flex
                  alignItems={"center"}
                  border={"1px solid purple"}
                  rounded={"20px"}
                  p={"5px"}
                  gap={"1em"}
                >
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      fontSize="1.2em"
                    >
                      <Image
                        width={20}
                        height={20}
                        alt={"polygon matic logo"}
                        src={"/assets/polygon-matic-logo.svg"}
                      />
                    </InputLeftElement>
                    <NumberInput
                      w={"100%"}
                      step={0.1}
                      min={0}
                      defaultValue={0.0}
                      name="fundAmount"
                      value={fundAmount}
                      onChange={(value) =>
                        onChange({ target: { name: "amount", value } })
                      }
                    >
                      <NumberInputField
                        pl={"2.5em"}
                        zIndex={"3"}
                        rounded={"15px"}
                        _focus={{
                          borderColor: "purple",
                        }}
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </InputGroup>
                  <Button
                    colorScheme="purple"
                    rounded={"15px"}
                    size={"md"}
                    isLoading={loading}
                    onClick={() => checkSignIn(address) && fundDonation()}
                    w={"40%"}
                  >
                    Fund
                  </Button>
                </Flex>

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
          )}
        </Center>
      </Container>
    </Box>
  );
};
