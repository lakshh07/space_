"use client";

import { Card } from "@/components/Card";
import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { Container } from "@chakra-ui/react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useAccountAbstraction, {
  contract,
} from "../hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";
import { useAccount } from "wagmi";
import makeStorageClient from "../hooks/useWeb3StorageClient";
import toast from "react-hot-toast";
import { ethers } from "ethers";

export const QuestClient = () => {
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
  // https://bafybeicz6whpwp2yd2tdu3e5vvu2k5ljujdlwuhxl5dowil4tooiwme4ba.ipfs.w3s.link/space_questData.json

  const create = async () => {
    setLoading(true);
    setDisabled(true);
    const tokenId = toast.loading("Saving file to ipfs...");
    const client = makeStorageClient();

    const newAmount = ethers.utils.parseEther(questData.amount.toString());
    let fileBlob = new File(
      [`${JSON.stringify({ ...questData, amount: newAmount.toString() })}`],
      `space_questData.json`,
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
      questData.amount,
      questData.xp
    );

    await useAccountAbstraction({
      setDisabled: setDisabled,
      setLoading: setLoading,
      transactionData: transaction,
      smartAccount: smartAccount,
    });
  };

  const lists = [
    {
      title: "HackOnline Hackathon",
      description:
        " Invite to join the hackthon with full team and power to win this hackthon and blah blah blah",
      duration: "2 week",
      amount: 1.2,
      points: 10,
      status: 1,
    },
    {
      title: "HackOnline Hackathon",
      description:
        " Invite to join the hackthon with full team and power to win this hackthon and blah blah blah",
      duration: "1 week",
      amount: 0.2,
      points: 20,
      status: 0,
    },
  ];

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header
        title="Quests"
        length={2}
        actionLabel="New Quest"
        isCampaign={false}
        isLoading={loading}
        isDisabled={disabled}
        onSubmit={create}
        formData={questData}
        setFormData={setQuestData}
      />

      {lists.map((list, index) => {
        return (
          <Card
            key={index}
            title={list.title}
            description={list.description}
            duration={list.duration}
            amount={list.amount}
            points={list.points}
            status={list.status}
          />
        );
      })}
    </Container>
  );
};
