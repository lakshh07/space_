import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

const useSubgraph = () => {
  const client = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/lakshh07/space",
    cache: new InMemoryCache(),
  });

  const questQuery = {
    query: gql`
      query {
        quests(first: 5) {
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
    `,
  };

  const campaignQuery = {
    query: gql`
      query {
        campaigns {
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
    `,
  };

  const creatorQuery = (address: string) => {
    return {
      query: gql`
        query {
          creators(where: { creator: ${address} }) {
            creator
            isVerified
            metadata
            totalXP
          }
        }
      `,
    };
  };

  return {
    client,
    questQuery,
    campaignQuery,
    creatorQuery,
  };
};

export default useSubgraph;
