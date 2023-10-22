"use client";

import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { useSmartAccountContext } from "@/context/userAccount";
import { Container, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { addToIPFS } from "../../hooks/useWeb3StorageClient";
import useAccountAbstraction, {
  contract,
} from "../../hooks/useAccountAbstraction";
import { ethers } from "ethers";
import { Range } from "react-date-range";
import { Card } from "@/components/Card";
import { useLoadingContext } from "@/context/loading";
import { useQuery } from "urql";
import useSubgraph from "@/hooks/useSubgraph";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
};

export type campaignDataType = {
  id: string;
  creator: string;
  metadata: string;
  amount: number;
  donatedAmount: number;
  totalDonors: number;
  status: boolean;
  xp: number;
};

export const CampaignsClient: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [campaignData, setCampaignData] = useState<fieldDataType>({
    title: "",
    description: "",
    duration: "",
    details: "",
    amount: 0,
    xp: 0,
  });
  const [dateRange, setDateRange] = useState<Range>(initialDateRange);
  const { smartAccount } = useSmartAccountContext();
  const { address } = useAccount();
  const { setMainLoading } = useLoadingContext();
  const { campaignQuery } = useSubgraph();
  const { accountAbstraction } = useAccountAbstraction();

  const [result, reexecuteQuery] = useQuery({
    query: campaignQuery,
  });
  const { data, fetching } = result;

  useEffect(() => {
    setMainLoading(false);
  }, [data]);

  const create = async () => {
    setLoading(true);
    setDisabled(true);

    const tokenId = toast.loading("Saving file to ipfs...");

    const newAmount = ethers.utils.parseEther(campaignData.amount.toString());
    const cid = await addToIPFS({
      ...campaignData,
      // @ts-ignore
      amount: newAmount.toString(),
      startDate: dateRange.startDate?.toString(),
      endDate: dateRange.endDate?.toString(),
    });

    toast.success("Files uploaded to IPFS.", {
      id: tokenId,
    });

    console.log(cid, "IPFS CID");

    const transaction = await contract.populateTransaction.createCampaign(
      uuidv4(),
      cid.toString(),
      address,
      newAmount.toString(),
      campaignData.xp
    );

    await accountAbstraction({
      setDisabled: setDisabled,
      setLoading: setLoading,
      transactionData: transaction,
      smartAccount: smartAccount,
    });

    setCampaignData({
      title: "",
      description: "",
      duration: "",
      details: "",
      amount: 0,
      xp: 0,
    });

    setTimeout(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, 3000);
  };

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header
        title="Campaigns"
        length={data?.campaigns?.length || 0}
        actionLabel="New Camapign"
        isCampaign={true}
        isLoading={loading}
        isDisabled={disabled}
        onSubmit={create}
        formData={campaignData}
        setFormData={setCampaignData}
        dateRange={dateRange}
        onChangeDate={(value) => setDateRange(value)}
        address={address}
      />

      {fetching ? (
        <Flex justifyContent={"center"} mt={"10em"}>
          <Spinner />
        </Flex>
      ) : (
        data?.campaigns?.map((list: campaignDataType, index: number) => {
          return (
            <Card
              key={index}
              id={list.id}
              index={index}
              creator={list.creator}
              amount={list.amount}
              status={list.status}
              metadata={list.metadata}
              isCampaign={true}
              reexecuteQuery={reexecuteQuery}
            />
          );
        })
      )}
    </Container>
  );
};
