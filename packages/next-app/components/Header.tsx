import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import React from "react";

interface HeaderProps {
  title: string;
  length: number;
  actionLabel: string;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  length,
  actionLabel,
}) => {
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
        borderWidth={"2px"}
        borderColor={"rgb(10 10 10/1)"}
        borderRadius={"0.625rem"}
        bg={"rgb(10 10 10/1)"}
        py={"0.375rem"}
        px={"1rem"}
        colorScheme={"black"}
      >
        {actionLabel}
      </Button>
    </Flex>
  );
};
