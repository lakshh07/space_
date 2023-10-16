import React from "react";
import { CampaignPageClient } from "./CampaignPageClient";

interface IParams {
  campaignId: string;
}

export default function CampaignPage({ params }: { params: IParams }) {
  return <CampaignPageClient campaignId={params.campaignId} />;
}
