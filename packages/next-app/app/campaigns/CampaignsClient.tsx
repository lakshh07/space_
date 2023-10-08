"use client";

import { Header } from "@/components/Header";
import { Container } from "@chakra-ui/react";
import React from "react";

export const CampaignsClient: React.FC = () => {
  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header title="Campaigns" length={2} actionLabel="New Camapign" />
    </Container>
  );
};
