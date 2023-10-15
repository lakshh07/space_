import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { questMetadataType } from "../Card";
import { ethers } from "ethers";
import useAccountAbstraction, {
  contract,
} from "@/app/hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";
import { useAccount, useWaitForTransaction } from "wagmi";
import toast from "react-hot-toast";

interface QuestModalProps {
  id: number;
  creator: string;
  status: boolean;
  assignedUser: string;
  metadata: questMetadataType | undefined;
  interestedUserArray: string[];
  isOpen: boolean;
  onClose: () => void;
}

export const QuestModal: React.FC<QuestModalProps> = ({
  id,
  creator,
  status,
  metadata,
  interestedUserArray,
  assignedUser,
  isOpen,
  onClose,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [completeQuestTxnData, setCompleteQuestTxnData] = useState<any>({
    id: "",
    hash: "",
    isSuccess: false,
  });
  const [owner, setOwner] = useState(false);

  const { smartAccount } = useSmartAccountContext();
  const { address } = useAccount();

  const createComment = async () => {
    if (address) {
      interestedUserArray.push(address);
      const interestedUserArrayString = interestedUserArray.toString();

      const transaction = await contract.populateTransaction.addQuestUser(
        id,
        interestedUserArrayString,
        address,
        comment
      );

      await useAccountAbstraction({
        setDisabled: setDisabled,
        setLoading: setLoading,
        transactionData: transaction,
        smartAccount: smartAccount,
      });
    }
  };

  const approveInterestedUser = async (userAddress: string) => {
    if (address) {
      const transaction =
        await contract.populateTransaction.approveQuestInterestedUser(
          id,
          userAddress
        );

      await useAccountAbstraction({
        setDisabled: setDisabled,
        setLoading: setLoading,
        transactionData: transaction,
        smartAccount: smartAccount,
      });
    }
  };

  const completeQuest = async (questAmount: number) => {
    const toastId = toast.loading("Transaction logging...");
    setLoading(true);
    setDisabled(true);

    const transaction = await contract.questComplete(id, {
      value: questAmount,
    });

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"3xl"}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      blockScrollOnMount
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton isDisabled={disabled} />
        <ModalHeader>Quest details</ModalHeader>
        {metadata ? (
          <ModalBody>
            <Box>
              <Flex alignItems={"center"} justifyContent={"space-between"}>
                <Heading fontSize={"22px"} fontWeight={600}>
                  {metadata?.title}
                </Heading>

                <Flex alignItems={"center"}>
                  <Badge
                    colorScheme="pink"
                    fontSize="0.8em"
                    border={"1px solid black"}
                    borderRadius={"0.425rem"}
                  >
                    {`${ethers.utils.formatEther(metadata?.amount)} MATIC`}
                  </Badge>
                  <Badge
                    colorScheme={"purple"}
                    fontSize="0.8em"
                    border={"1px solid black"}
                    mx={"1em"}
                    borderRadius={"0.425rem"}
                  >
                    {`${metadata?.xp} XP`}
                  </Badge>
                  <Badge
                    colorScheme={status ? "green" : "orange"}
                    fontSize="0.8em"
                    border={"1px solid black"}
                    borderRadius={"0.425rem"}
                  >
                    {status ? "Completed" : "Ongoing"}
                  </Badge>
                </Flex>
              </Flex>

              <Text color={"blackAlpha.700"} fontSize={"14px"}>
                Owner: {creator}
              </Text>

              <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                Duration:
              </Text>
              <Text>{metadata?.duration}</Text>

              <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                Description:
              </Text>
              <Text>{metadata?.description}</Text>

              <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                Details:
              </Text>
              <Text>{metadata?.details}</Text>

              <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                Interested Users:
              </Text>
              {interestedUserArray.map((userAddress, index) => {
                return (
                  <Flex
                    mb={"1em"}
                    alignItems={"flex-start"}
                    justifyContent={"space-between"}
                    w={"70%"}
                    key={index}
                  >
                    <Box>
                      <Text fontSize={"14px"} color={"blackAlpha.700"}>
                        {userAddress}
                      </Text>
                      <Text>i will do</Text>
                    </Box>

                    {owner && (
                      <Button
                        colorScheme="purple"
                        rounded={"15px"}
                        size={"xs"}
                        variant={"outline"}
                        isLoading={loading}
                        onClick={() => approveInterestedUser(userAddress)}
                      >
                        Approve
                      </Button>
                    )}
                  </Flex>
                );
              })}

              <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                Assigned:
              </Text>
              <Text fontSize={"14px"} color={"blackAlpha.700"}>
                {assignedUser ? assignedUser : "None"}
              </Text>
            </Box>
          </ModalBody>
        ) : (
          <Flex alignItems={"center"} justifyContent={"center"}>
            <Spinner />
          </Flex>
        )}
        <ModalFooter>
          {status ? (
            <Button
              rounded={"15px"}
              colorScheme="purple"
              variant={"outline"}
              pointerEvents={"none"}
            >
              Quest Completed
            </Button>
          ) : assignedUser ? (
            <Button
              rounded={"15px"}
              colorScheme="purple"
              variant={"outline"}
              pointerEvents={"none"}
            >
              User Assigned
            </Button>
          ) : owner ? (
            <Button
              rounded={"15px"}
              colorScheme="purple"
              isLoading={loading}
              onClick={() => metadata && completeQuest(metadata?.amount)}
            >
              Close Quest
            </Button>
          ) : (
            <>
              <Input
                placeholder="add comment.."
                rounded={"15px"}
                w={"81%"}
                mr={"1rem"}
                name={"comment"}
                value={comment}
                isDisabled={disabled}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                rounded={"15px"}
                colorScheme="purple"
                isLoading={loading}
                isDisabled={comment.length ? false : true}
                onClick={createComment}
              >
                Want to do?
              </Button>
            </>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
