import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Divider,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Flex,
  InputGroup,
  InputLeftElement,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { Range } from "react-date-range";
import DatePicker from "./DataPicker";

export type fieldDataType = {
  title: string;
  description: string;
  duration?: string;
  details?: string;
  amount: number;
  xp: number;
  startDate?: string;
  endDate?: string;
};

interface NewQuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: fieldDataType;
  setFormData: React.Dispatch<React.SetStateAction<fieldDataType>>;
  title: string;
  isCampaign: boolean;
  isLoading: boolean;
  isDisabled: boolean;
  dateRange?: Range;
  onChangeDate?: (value: Range) => void;
}

export const CreateModal: React.FC<NewQuestModalProps> = ({
  isOpen,
  onClose,
  title,
  onSubmit,
  isCampaign,
  isDisabled,
  isLoading,
  formData,
  setFormData,
  dateRange,
  onChangeDate,
}) => {
  function onChange(e: any) {
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value }));
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={"2xl"}
      isCentered
      blockScrollOnMount
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton mt={"0.5rem"} isDisabled={isDisabled} />

        <ModalHeader>{title}</ModalHeader>

        <Divider />
        <ModalBody>
          <Box my={"2em"}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={onChange}
                _focus={{
                  borderColor: "purple",
                }}
              />
            </FormControl>

            <FormControl mt={"1em"} isRequired>
              <FormLabel>Description</FormLabel>

              {isCampaign ? (
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  placeholder={
                    "how your campaign will function or how the funds raised will be utilized"
                  }
                  _focus={{
                    borderColor: "purple",
                  }}
                />
              ) : (
                <Input
                  name="description"
                  value={formData.description}
                  onChange={onChange}
                  _focus={{
                    borderColor: "purple",
                  }}
                />
              )}
            </FormControl>

            {!isCampaign && (
              <FormControl mt={"1em"}>
                <FormLabel>Details</FormLabel>
                <Textarea
                  name="details"
                  value={formData.details}
                  onChange={onChange}
                  placeholder={
                    "What do you need and how do you want it to be done?"
                  }
                  _focus={{
                    borderColor: "purple",
                  }}
                />
              </FormControl>
            )}

            {isCampaign && dateRange && onChangeDate ? (
              <FormControl mt={"1em"} isRequired w={"100%"}>
                <FormLabel>Select Date</FormLabel>
                <DatePicker
                  value={dateRange}
                  onChange={(value) => onChangeDate(value.selection)}
                />
              </FormControl>
            ) : (
              <FormControl mt={"1em"} isRequired>
                <FormLabel>Duration</FormLabel>
                <Input
                  name="duration"
                  value={formData.duration}
                  onChange={onChange}
                  placeholder={"10 days or 1 week"}
                  _focus={{
                    borderColor: "purple",
                  }}
                />
              </FormControl>
            )}

            <Flex alignItems={"center"} gap={"2rem"}>
              <FormControl mt={"1em"} isRequired>
                <FormLabel>{isCampaign ? "Goal" : "Amount"}</FormLabel>
                <InputGroup
                  _focus={{
                    borderColor: "purple",
                  }}
                >
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                  >
                    <Image
                      width={20}
                      height={20}
                      alt={"polygon matic logo"}
                      src={"/assets/polygon-matic-logo.svg"}
                    />
                  </InputLeftElement>
                  <NumberInput
                    w={"100%"}
                    step={0.1}
                    min={0}
                    defaultValue={0.0}
                    name="amount"
                    value={formData.amount}
                    onChange={(value) =>
                      onChange({ target: { name: "amount", value } })
                    }
                  >
                    <NumberInputField pl={"2.5em"} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </FormControl>

              <FormControl mt={"1em"} isRequired>
                <FormLabel>XP</FormLabel>
                <InputGroup
                  _focus={{
                    borderColor: "purple",
                  }}
                >
                  <NumberInput
                    w={"100%"}
                    min={0}
                    defaultValue={0}
                    value={formData.xp}
                    onChange={(value) =>
                      onChange({ target: { name: "xp", value } })
                    }
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
              </FormControl>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="purple"
            variant={"ghost"}
            mr={3}
            rounded={"15px"}
            onClick={onClose}
            isDisabled={isDisabled}
          >
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            rounded={"15px"}
            onClick={onSubmit}
            isLoading={isLoading}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
