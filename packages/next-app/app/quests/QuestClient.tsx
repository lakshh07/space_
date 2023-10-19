"use client";

import { Card } from "@/components/Card";
import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { Container } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useAccountAbstraction, { contract } from "@/hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";
import { useAccount } from "wagmi";
import { addToIPFS } from "@/hooks/useWeb3StorageClient";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { useLoadingContext } from "@/context/loading";
import axios from "axios";

export type questDataType = {
  id: string;
  creator: string;
  metadata: string;
  amount: number;
  status: boolean;
  xp: number;
  assigned: string;
  interestedUser: string;
};

export const QuestClient: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [questData, setQuestData] = useState<fieldDataType>({
    title: "",
    description: "",
    duration: "",
    details: "",
    amount: 0,
    xp: 0,
  });
  const { smartAccount } = useSmartAccountContext();
  const { address } = useAccount();
  const { setMainLoading } = useLoadingContext();
  const [data, setData] = useState<questDataType[]>([]);

  const getData = async () => {
    await axios.get("/api/quests").then((res) => {
      setData(res?.data?.quests);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    setMainLoading(false);
  }, [data]);

  const create = async () => {
    setLoading(true);
    setDisabled(true);
    const tokenId = toast.loading("Saving file to ipfs...");

    const newAmount = ethers.utils.parseEther(questData.amount.toString());
    const cid = await addToIPFS({
      ...questData,
      // @ts-ignore
      amount: newAmount.toString(),
    });
    console.log(cid, "IPFS CID");

    toast.success("Files uploaded to IPFS.", {
      id: tokenId,
    });

    const transaction = await contract.populateTransaction.createQuest(
      uuidv4(),
      cid.toString(),
      address,
      newAmount.toString(),
      questData.xp
    );

    await useAccountAbstraction({
      setDisabled: setDisabled,
      setLoading: setLoading,
      transactionData: transaction,
      smartAccount: smartAccount,
    });

    setQuestData({
      title: "",
      description: "",
      duration: "",
      details: "",
      amount: 0,
      xp: 0,
    });
  };

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header
        title="Quests"
        length={data?.length || 0}
        actionLabel="New Quest"
        isCampaign={false}
        isLoading={loading}
        isDisabled={disabled}
        onSubmit={create}
        formData={questData}
        setFormData={setQuestData}
      />

      {data?.map((list, index) => {
        return (
          <Card
            key={index}
            index={index}
            creator={list.creator}
            amount={list.amount}
            status={list.status}
            interestedUser={list.interestedUser}
            assignedUser={list.assigned}
            metadata={list.metadata}
          />
        );
      })}
    </Container>
  );
};
