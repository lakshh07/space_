import { NextResponse } from "next/server";
import useSubgraph from "@/hooks/useSubgraph";

export async function GET(request: Request) {
  const { client, campaignQuery } = useSubgraph();

  const { data } = await client.query(campaignQuery);

  return NextResponse.json({ campaigns: data.campaigns });
}
