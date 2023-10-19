import { NextResponse } from "next/server";
import useSubgraph from "@/hooks/useSubgraph";

export async function GET(request: Request) {
  const { client, questQuery } = useSubgraph();

  const { data } = await client.query(questQuery);

  return NextResponse.json({ quests: data.quests });
}
