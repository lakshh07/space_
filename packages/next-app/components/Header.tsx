import { Button, Flex, Heading, Text, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { CreateModal, fieldDataType } from "./CreateModal";
import { Range } from "react-date-range";
import { checkSignIn } from "@/utils/checkSignIn";

interface HeaderProps {
  title: string;
  length: number;
  address?: string;
  actionLabel: string;
  formData: fieldDataType;
  setFormData: React.Dispatch<React.SetStateAction<fieldDataType>>;
  isCampaign: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  onSubmit: () => void;
  dateRange?: Range;
  onChangeDate?: (value: Range) => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  length,
  actionLabel,
  formData,
  setFormData,
  isCampaign,
  isLoading,
  isDisabled,
  onSubmit,
  dateRange,
  onChangeDate,
  address,
}) => {
  const { isOpen, onClose, onOpen } = useDisclosure();

  return (
    <Flex alignItems={"center"} justifyContent={"space-between"} mb={"2.5em"}>
      <Flex alignItems={"center"}>
        <Heading fontSize={"2.25rem"} lineHeight={"2.5rem"} fontWeight={700}>
          {title}
        </Heading>

        <Text
          w={"2rem"}
          alignItems={"center"}
          justifyContent={"center"}
          fontSize={"1.2rem"}
          lineHeight={"2rem"}
          bg={"black"}
          color={"white"}
          textAlign={"center"}
          borderRadius={"50%"}
          ml={"0.75rem"}
          fontWeight={700}
        >
          {length}
        </Text>
      </Flex>

      <Button
        borderRadius={"15px"}
        colorScheme={"purple"}
        onClick={() => checkSignIn(address) && onOpen()}
      >
        {actionLabel}
      </Button>

      <CreateModal
        isOpen={isOpen}
        onClose={onClose}
        title={actionLabel}
        formData={formData}
        setFormData={setFormData}
        isCampaign={isCampaign}
        onSubmit={onSubmit}
        isLoading={isLoading}
        isDisabled={isDisabled}
        dateRange={dateRange}
        onChangeDate={onChangeDate}
      />
    </Flex>
  );
};
