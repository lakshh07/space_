import { NextResponse } from "next/server";
import useSubgraph from "@/hooks/useSubgraph";
import { gql } from "@apollo/client";

interface IParams {
  creatorAddress: string;
}

export async function GET(request: Request, { params }: { params: IParams }) {
  const { creatorAddress } = params;
  const { client, creatorQuery } = useSubgraph();

  //   const { data } = await client.query(creatorQuery(creatorAddress));
  const { data } = await client.query({
    query: gql`
      query {
        creators(where: { creator: ${creatorAddress} }) {
          creator
          isVerified
          metadata
          totalXP
        }
      }
    `,
  });

  return NextResponse.json({ creators: data.creators });
}
