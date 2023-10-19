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
      campaigns(id: $id) {
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

  const creatorQueryById = gql`
    query($creator: String) {
      creators(creator: $creator) {
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
    campaignQueryById,
    creatorQueryById,
  };
};

export default useSubgraph;
