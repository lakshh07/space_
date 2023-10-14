"use client";

import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { useSmartAccountContext } from "@/context/userAccount";
import { Container } from "@chakra-ui/react";
import React, { useState } from "react";
import { useAccount } from "wagmi";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import makeStorageClient from "../hooks/useWeb3StorageClient";
import useAccountAbstraction, {
  contract,
} from "../hooks/useAccountAbstraction";
import { ethers } from "ethers";

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
  const { smartAccount } = useSmartAccountContext();
  const { address } = useAccount();

  const create = async () => {
    setLoading(true);
    setDisabled(true);
    const tokenId = toast.loading("Saving file to ipfs...");
    const client = makeStorageClient();

    const newAmount = ethers.utils.parseEther(campaignData.amount.toString());
    let fileBlob = new File(
      [`${JSON.stringify({ ...campaignData, amount: newAmount.toString() })}`],
      `space_campaignData.json`,
      { type: "application/json" }
    );
    const cid = await client.put([fileBlob]);

    toast.success("Files uploaded to IPFS.", {
      id: tokenId,
    });

    const transaction = await contract.populateTransaction.createQuest(
      uuidv4(),
      cid.toString(),
      address,
      campaignData.amount,
      campaignData.xp
    );

    await useAccountAbstraction({
      setDisabled: setDisabled,
      setLoading: setLoading,
      transactionData: transaction,
      smartAccount: smartAccount,
    });
  };

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header
        title="Campaigns"
        length={2}
        actionLabel="New Camapign"
        isCampaign={true}
        isLoading={loading}
        isDisabled={disabled}
        onSubmit={create}
        formData={campaignData}
        setFormData={setCampaignData}
      />
    </Container>
  );
};
