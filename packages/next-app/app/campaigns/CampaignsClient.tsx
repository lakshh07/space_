"use client";

import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { useSmartAccountContext } from "@/context/userAccount";
import { Container } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import { addToIPFS } from "../hooks/useWeb3StorageClient";
import useAccountAbstraction, {
  contract,
} from "../hooks/useAccountAbstraction";
import { ethers } from "ethers";
import { Range } from "react-date-range";
import { Card } from "@/components/Card";
import { useLoadingContext } from "@/context/loading";

const initialDateRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: "selection",
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

    const transaction = await contract.populateTransaction.createQuest(
      uuidv4(),
      cid.toString(),
      address,
      parseFloat(newAmount.toString()),
      campaignData.xp
    );

    await useAccountAbstraction({
      setDisabled: setDisabled,
      setLoading: setLoading,
      transactionData: transaction,
      smartAccount: smartAccount,
    });
  };

  const sampleData = [
    {
      id: "adcadc-sc-s-a-cacdcd-ad",
      creator: "0xc632F549D5107C32B9FF47937DAB11008b1e2636",
      metadata: "bafybeicpc5f32gkmc6f4c6i4i6nqykpbbj7vr3qgbxyaalkhcf6p57bika",
      amount: 700000000000000,
      donatedAmount: 3000000000000,
      totalDonors: 12,
      status: false,
      xp: 5,
    },
    // {
    //   id: "adcadc-sc-s-a-cac-ad",
    //   creator: "0xc632F549D5107C32B9FF47937DAB11008b1e2636",
    //   metadata: "bafybeih5speevxm53vegwwcgz37azvsiry5upufesy6sz34oabte3a4icm",
    //   amount: 700000000000000,
    //   donatedAmount: 3000000000000,
    //   totalDonors: 12,
    //   status: false,
    //   xp: 5,
    // },
  ];

  useEffect(() => {
    setMainLoading(false);
  }, [sampleData]);

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header
        title="Campaigns"
        length={sampleData.length}
        actionLabel="New Camapign"
        isCampaign={true}
        isLoading={loading}
        isDisabled={disabled}
        onSubmit={create}
        formData={campaignData}
        setFormData={setCampaignData}
        dateRange={dateRange}
        onChangeDate={(value) => setDateRange(value)}
      />

      {sampleData.map((list, index) => {
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
          />
        );
      })}
    </Container>
  );
};
