"use client";

import { Card } from "@/components/Card";
import { fieldDataType } from "@/components/CreateModal";
import { Header } from "@/components/Header";
import { Container, Flex, Spinner } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import useAccountAbstraction, { contract } from "@/hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";
import { useAccount } from "wagmi";
import { addToIPFS } from "@/hooks/useWeb3StorageClient";
import toast from "react-hot-toast";
import { ethers } from "ethers";
import { useLoadingContext } from "@/context/loading";
import { useQuery } from "urql";
import useSubgraph from "@/hooks/useSubgraph";

export type questDataType = {
  id: string;
  creator: string;
  metadata: string;
  amount: number;
  status: boolean;
  xp: number;
  assigned: string;
  interestedUsers: string;
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
  const { questQuery } = useSubgraph();
  const { accountAbstraction } = useAccountAbstraction();

  const [result, reexecuteQuery] = useQuery({
    query: questQuery,
  });
  const { data, fetching } = result;

  // reexecuteQuery({ requestPolicy: "network-only" })
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

    await accountAbstraction({
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

    setTimeout(() => {
      reexecuteQuery({ requestPolicy: "network-only" });
    }, 3000);
  };

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header
        title="Quests"
        length={data?.quests?.length || 0}
        actionLabel="New Quest"
        isCampaign={false}
        isLoading={loading}
        isDisabled={disabled}
        onSubmit={create}
        formData={questData}
        setFormData={setQuestData}
        address={address}
      />

      {fetching ? (
        <Flex justifyContent={"center"} mt={"10em"}>
          <Spinner />
        </Flex>
      ) : (
        data?.quests?.map((list: questDataType, index: number) => {
          return (
            <Card
              key={index}
              id={list.id.toString()}
              index={index}
              creator={list.creator}
              amount={list.amount}
              status={list.status}
              interestedUser={list.interestedUsers}
              assignedUser={list.assigned}
              metadata={list.metadata}
              reexecuteQuery={reexecuteQuery}
            />
          );
        })
      )}
    </Container>
  );
};
