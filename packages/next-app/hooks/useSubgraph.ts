import { gql } from "urql";

const useSubgraph = () => {
  const questQuery = gql`
    query {
      quests(first: 20) {
        id
        creator
        metadata
        amount
        status
        xp
        assigned
        interestedUsers
      }
    }
  `;

  const campaignQuery = gql`
    query {
      campaigns(first: 20) {
        id
        creator
        metadata
        totalAmount
        donatedAmount
        totalDonors
        status
        xp
      }
    }
  `;

  const campaignQueryById = gql`
    query($id: String) {
      campaigns(where: { id: $id }) {
        id
        creator
        metadata
        totalAmount
        donatedAmount
        totalDonors
        status
        xp
      }
    }
  `;

  const creatorQuery = gql`
    query($address: String) {
      quests(
        where: {
          creator: $address
          assigned_not: "0x0000000000000000000000000000000000000000"
        }
      ) {
        id
        creator
        metadata
      }
      donors(where: { donor: $address }) {
        id
        donor
        amount
      }
      campaigns(where: { totalDonors_gte: 1 }) {
        id
        creator
        metadata
        totalDonors
      }
      creators(where: { creator: $address }) {
        id
        creator
        isVerified
        metadata
        totalXP
      }
    }
  `;

  return {
    questQuery,
    campaignQuery,
    creatorQuery,
    campaignQueryById,
  };
};

export default useSubgraph;
