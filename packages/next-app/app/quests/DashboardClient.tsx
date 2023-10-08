"use client";

import { Card } from "@/components/Card";
import { Header } from "@/components/Header";
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
} from "@chakra-ui/react";
import React from "react";

export const DashboardClient = () => {
  const lists = [
    {
      title: "HackOnline Hackathon",
      description:
        " Invite to join the hackthon with full team and power to win this hackthon and blah blah blah",
      duration: "2 week",
      amount: 1.2,
      points: 10,
      status: 1,
    },
    {
      title: "HackOnline Hackathon",
      description:
        " Invite to join the hackthon with full team and power to win this hackthon and blah blah blah",
      duration: "1 week",
      amount: 0.2,
      points: 20,
      status: 0,
    },
  ];

  return (
    <Container my={"4rem"} maxW={"1200px"}>
      <Header title="Quests" length={2} actionLabel="New Quest" />

      {lists.map((list, index) => {
        return (
          <Card
            key={index}
            title={list.title}
            description={list.description}
            duration={list.duration}
            amount={list.amount}
            points={list.points}
            status={list.status}
          />
        );
      })}
    </Container>
  );
};
