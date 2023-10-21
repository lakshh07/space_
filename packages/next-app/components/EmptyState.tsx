"use client";

import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface EmptyStateProps {
  title?: string;
  subtitle?: string;
  showReset?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No exact matches",
  subtitle = "Try changing or removing some of your filters.",
  showReset,
}) => {
  const router = useRouter();

  return (
    <Flex
      h={"60vh"}
      flexDir={"column"}
      gap={2}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Heading fontSize={"2xl"}>{title}</Heading>
      <Text color={"blackAlpha.700"}>{subtitle}</Text>
      <Box mt={"2em"}>
        {showReset && (
          <Button variant={"outline"} onClick={() => router.push("/")}>
            Remove all filters
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default EmptyState;
