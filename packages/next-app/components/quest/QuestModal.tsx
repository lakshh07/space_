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
import React, { useState } from "react";
import { MetadataType } from "../Card";
import { ethers } from "ethers";
import useAccountAbstraction, {
  contract,
  signerContract,
} from "@/hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import { ethersProvider } from "@/utils/rainbowConfig";
import { checkSignIn } from "@/utils/checkSignIn";
import { UseQueryExecute } from "urql";
import { readContract } from "@wagmi/core";
import spaceAbi from "@/contracts/ABI/Space.json";
interface QuestModalProps {
  id: number;
  creator: string;
  status: boolean;
  assignedUser?: string;
  metadata: MetadataType | undefined;
  interestedUserArray?: string[];
  isOpen: boolean;
  onClose: () => void;
  reexecuteQuery: UseQueryExecute;
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
  reexecuteQuery,
}) => {
  const [disabled, setDisabled] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");

  const { smartAccount } = useSmartAccountContext();
  const { address } = useAccount();
  const { accountAbstraction } = useAccountAbstraction();

  const getComments = async (address: string) => {
    const data: any = await readContract({
      address: "0x67A94C43b74562aa461e3cf0ED91CfF66427312D",
      abi: spaceAbi,
      functionName: "fetchInterestedUserComment",
      args: [id, address],
    });
    return data;
  };

  const createComment = async () => {
    if (address) {
      interestedUserArray?.push(address);
      const interestedUserArrayString = interestedUserArray?.toString();

      const transaction = await contract.populateTransaction.addQuestUser(
        id,
        interestedUserArrayString,
        address,
        comment
      );

      await accountAbstraction({
        setDisabled: setDisabled,
        setLoading: setLoading,
        transactionData: transaction,
        smartAccount: smartAccount,
      });

      setComment("");

      setTimeout(() => {
        reexecuteQuery({ requestPolicy: "network-only" });
      }, 3000);
    }
  };

  const approveInterestedUser = async (userAddress: string) => {
    if (address) {
      const transaction = await contract.populateTransaction.approveQuestInterestedUser(
        id,
        userAddress
      );

      await accountAbstraction({
        setDisabled: setDisabled,
        setLoading: setLoading,
        transactionData: transaction,
        smartAccount: smartAccount,
      });

      setTimeout(() => {
        reexecuteQuery({ requestPolicy: "network-only" });
      }, 3000);
    }
  };

  const completeQuest = async (questAmount: number) => {
    const toastId = toast.loading("Transaction logging...");
    setLoading(true);
    setDisabled(true);

    const transaction = await signerContract.questComplete(id, {
      value: questAmount,
    });

    ethersProvider
      .waitForTransaction(transaction?.hash)
      .then((receipt) => {
        console.log(receipt);
        if (receipt.status == 1) {
          setLoading(false);
          setDisabled(false);
          toast.success("Transaction Successfull", { id: toastId });
          setTimeout(() => {
            reexecuteQuery({ requestPolicy: "network-only" });
          }, 3000);
        }
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

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
                <Heading
                  fontSize={"22px"}
                  fontWeight={600}
                  textTransform={"capitalize"}
                >
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

              {interestedUserArray &&
                (interestedUserArray[0]?.length ||
                  interestedUserArray[1]?.length) && (
                  <>
                    <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                      Interested Users:
                    </Text>
                    {interestedUserArray
                      ?.filter((list) => {
                        return list.length;
                      })
                      .map(async (userAddress, index) => {
                        const cmt: string = await getComments(userAddress);
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
                              <Text>{cmt}</Text>
                            </Box>

                            {assignedUser ===
                              "0x0000000000000000000000000000000000000000" &&
                              address?.toUpperCase() ===
                                creator.toUpperCase() && (
                                <Button
                                  colorScheme="purple"
                                  rounded={"15px"}
                                  size={"xs"}
                                  variant={"outline"}
                                  isLoading={loading}
                                  onClick={() =>
                                    approveInterestedUser(userAddress)
                                  }
                                >
                                  Approve
                                </Button>
                              )}
                          </Flex>
                        );
                      })}
                  </>
                )}
              <Text mt={"1em"} fontWeight={600} fontSize={"17px"}>
                Assigned:
              </Text>
              <Text fontSize={"14px"} color={"blackAlpha.700"}>
                {assignedUser === "0x0000000000000000000000000000000000000000"
                  ? "None"
                  : assignedUser}
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
          ) : assignedUser === "0x0000000000000000000000000000000000000000" ? (
            <>
              <Input
                placeholder="add comment.."
                rounded={"15px"}
                w={"81%"}
                mr={"1rem"}
                name={"comment"}
                value={comment}
                isDisabled={disabled}
                autoComplete="off"
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                rounded={"15px"}
                colorScheme="purple"
                isLoading={loading}
                isDisabled={comment.length ? false : true}
                onClick={() => {
                  checkSignIn(address) && createComment();
                }}
              >
                Want to do?
              </Button>
            </>
          ) : (
            <Button
              rounded={"15px"}
              colorScheme="purple"
              variant={"outline"}
              pointerEvents={"none"}
            >
              User Assigned
            </Button>
          )}

          {address?.toUpperCase() === creator.toUpperCase() && (
            <Button
              ml={"1rem"}
              rounded={"15px"}
              colorScheme="purple"
              isLoading={loading}
              onClick={() => metadata && completeQuest(metadata?.amount)}
            >
              Close Quest
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
