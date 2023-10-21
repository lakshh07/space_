import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  Button,
  Center,
  Spinner,
  Link,
} from "@chakra-ui/react";
import { HiOutlineExternalLink } from "react-icons/hi";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";
import useAccountAbstraction, { contract } from "@/hooks/useAccountAbstraction";
import { useSmartAccountContext } from "@/context/userAccount";

interface QRCodeModalProps {
  address?: string;
  credentialType?: string;
  onVerificationResult?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  credentialType = "SpaceMembership",
  address,
  onVerificationResult = false,
  isOpen,
  onClose,
}) => {
  const [sessionId, setSessionId] = useState<string>("");
  const [qrCodeData, setQrCodeData] = useState<any>();
  const [isHandlingVerification, setIsHandlingVerification] = useState<boolean>(
    false
  );
  const [verificationCheckComplete, setVerificationCheckComplete] = useState<
    boolean
  >(false);
  const [verificationMessage, setVerfificationMessage] = useState<string>("");
  const [socketEvents, setSocketEvents] = useState<any[]>([]);
  const [verified, setVerified] = useState<boolean>(false);
  const [windoww, setWindoww] = useState<any>();

  const { smartAccount } = useSmartAccountContext();
  const { accountAbstraction } = useAccountAbstraction();

  const publicServerURL = process.env
    .NEXT_PUBLIC_VERIFICATION_SERVER_PUBLIC_URL as string;
  const localServerURL = process.env
    .NEXT_PUBLIC_VERIFICATION_SERVER_LOCAL_HOST_URL as string;

  const issuerOrHowToLink = process.env.NEXT_PUBLIC_ISSUER_LINK as string;

  const serverUrl = publicServerURL;

  const getQrCodeApi = (sessionId: string) =>
    serverUrl + `/api/get-auth-qr?sessionId=${sessionId}`;

  const socket = io(serverUrl);

  useEffect(() => {
    setWindoww(window.location);
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      setSessionId(socket.id);

      // only watch this session's events
      socket.on(socket.id, (arg) => {
        setSocketEvents((socketEvents) => [...socketEvents, arg]);
      });
    });
  }, []);

  useEffect(() => {
    const fetchQrCode = async () => {
      const response = await fetch(getQrCodeApi(sessionId));
      const data = await response.text();
      console.log(JSON.parse(data));
      return JSON.parse(data);
    };

    if (sessionId) {
      fetchQrCode()
        .then(setQrCodeData)
        .catch(console.error);
    }
  }, [sessionId]);

  // socket event side effects
  useEffect(() => {
    if (socketEvents.length) {
      const currentSocketEvent = socketEvents[socketEvents.length - 1];

      if (currentSocketEvent?.fn === "handleVerification") {
        if (currentSocketEvent?.status === "IN_PROGRESS") {
          setIsHandlingVerification(true);
        } else {
          setIsHandlingVerification(false);
          setVerificationCheckComplete(true);
          if (currentSocketEvent.status === "DONE") {
            setVerfificationMessage("✅ Verified proof");
            setTimeout(() => {
              reportVerificationResult(true);
            }, 2000);
            socket.close();
          } else {
            setVerfificationMessage("❌ Error verifying VC");
          }
        }
      }
    }
  }, [socketEvents]);

  // callback, send verification result back to app
  const reportVerificationResult = async (result: boolean) => {
    setVerified(result);

    if (address) {
      const transaction = await contract.populateTransaction.changeCreatorVerification(
        address
      );

      await accountAbstraction({
        transactionData: transaction,
        smartAccount: smartAccount,
      });
    }
  };

  return (
    <Box>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        motionPreset={"slideInBottom"}
        size={"md"}
        blockScrollOnMount
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader mt={"1.4rem"} fontSize={"18px"}>
            Scan this QR code from your PolygonID Wallet App to prove access
            rights
          </ModalHeader>

          <ModalBody textAlign={"center"} fontSize={"12px"}>
            {" "}
            {qrCodeData ? (
              <Box>
                {isHandlingVerification && (
                  <Box>
                    <Text>Authenticating...</Text>
                    <Spinner size={"xl"} colorScheme="purple" my={2} />
                  </Box>
                )}
                {verificationMessage}
                {qrCodeData &&
                  !isHandlingVerification &&
                  !verificationCheckComplete && (
                    <Box
                      p={"1rem"}
                      mb={"0.5rem"}
                      border={"1px solid purple"}
                      w={"min-content"}
                      mx={"auto"}
                      rounded={"15px"}
                    >
                      <Center>
                        <QRCode value={JSON.stringify(qrCodeData)} />
                      </Center>
                    </Box>
                  )}

                {qrCodeData && qrCodeData.body?.scope[0]?.query && (
                  <Text mt={"1em"}>
                    Type: {qrCodeData?.body?.scope[0]?.query.type}
                  </Text>
                )}

                {qrCodeData?.body.message && (
                  <Text>{qrCodeData.body.message}</Text>
                )}

                {qrCodeData?.body.reason && (
                  <Text>Reason: {qrCodeData.body.reason}</Text>
                )}
              </Box>
            ) : (
              <Spinner size={"xl"} colorScheme="purple" my={2} />
            )}
          </ModalBody>

          <ModalFooter w={"100%"} justifyContent={"center"}>
            <Link
              href={
                "https://0xpolygonid.github.io/tutorials/wallet/wallet-overview/#quick-start"
              }
              isExternal
            >
              <Button
                fontSize={"10px"}
                margin={1}
                colorScheme="purple"
                rightIcon={<HiOutlineExternalLink />}
              >
                Download the Polygon ID Wallet App
              </Button>
            </Link>

            <Link href={issuerOrHowToLink} isExternal>
              <Button
                fontSize={"10px"}
                margin={1}
                colorScheme="purple"
                rightIcon={<HiOutlineExternalLink />}
              >
                Get a {credentialType} VC
              </Button>
            </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
