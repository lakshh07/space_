"use client";

import { Card } from "@/components/Card";
import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { Container } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useAccountAbstraction, {
  contract,
} from "../hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";
import { useAccount } from "wagmi";
import { addToIPFS } from "../hooks/useWeb3StorageClient";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { useLoadingContext } from "@/context/loading";

export type questDataType = {
  id: string;
  creator: string;
  metadata: string;
  amount: number;
  status: boolean;
  xp: number;
  assigned: string;
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
  // https://bafybeicz6whpwp2yd2tdu3e5vvu2k5ljujdlwuhxl5dowil4tooiwme4ba.ipfs.w3s.link/space_questData.json

  const sampleData = [
    {
      id: "dchbuwd6cgwyidgc8w",
      creator: "0xc632F549D5107C32B9FF47937DAB11008b1e2636",
      metadata: "bafybeich5ihaju3d7ojqnaxknwxg4vsdb4ccewfd435ebmd72kcegb3nrm",
      amount: 2000000000000000,
      status: false,
      xp: 10,
      interestedUser:
        "0x1632F549D5107C32B9FF47937DAB11008b1e2636,0x987F549D5107C32B9FF47937DAB11008b1e2636,0x6532F549D5107C32B9FF47937DAB11008b1e2636",
      assigned: "",
    },
    {
      id: "dchbuwd6cgwyidgc8w",
      creator: "0xc632F549D5107C32B9FF47937DAB11008b1e2636",
      metadata: "bafybeiapcbhqiglgyt2rk6il5n5tztrf7mofni43dqhil6g77wqtwmjh6e",
      amount: 2000000000000000,
      status: false,
      xp: 10,
      interestedUser: "0x1632F549D5107C32B9FF47937DAB11008b1e2636",
      assigned: "0x3632F549D5107C32B9FF47937DAB11008b1e2636",
    },
  ];

  useEffect(() => {
    setMainLoading(false);
  }, [sampleData]);

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
      parseFloat(newAmount.toString()),
      questData.xp
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

      {sampleData.map((list, index) => {
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
