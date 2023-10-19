import {
  QuestAssigned as QuestAssignedEvent,
  CampaignCreated as CampaignCreatedEvent,
  CampaignDeleted as CampaignDeletedEvent,
  CampaignStatusChanged as CampaignStatusChangedEvent,
  CreatorMetadataChanged as CreatorMetadataChangedEvent,
  CreatorVerified as CreatorVerifiedEvent,
  DonateToCampaign as DonateToCampaignEvent,
  QuestCompleted as QuestCompletedEvent,
  QuestCreated as QuestCreatedEvent,
  QuestDeleted as QuestDeletedEvent,
  QuestUserAdded as QuestUserAddedEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
} from "../generated/Space_/Space_";
import { Campaign, Creator, Donor, Quest } from "../generated/schema";

export function handleQuestCreated(event: QuestCreatedEvent): void {
  let quest = new Quest(event.params.id.toString());

  quest.id = event.params.id;
  quest.amount = event.params.amount;
  quest.assigned = event.params.assigned;
  quest.creator = event.params.creator;
  quest.metadata = event.params.metadata;
  quest.interestedUsers = event.params.interestedUsers;
  quest.status = event.params.status;
  quest.xp = event.params.xp;

  quest.save();
}

//QuestAssigned
export function handleQuestUserAdded(event: QuestUserAddedEvent): void {
  let quest = Quest.load(event.params.id.toString());
  if (quest) {
    quest.interestedUsers = event.params.interestedUserAddresses;
    quest.save();
  }
}

export function handleQuestAssigned(event: QuestAssignedEvent): void {
  let quest = Quest.load(event.params.id.toString());
  if (quest) {
    quest.assigned = event.params.interestedUser;
    quest.save();
  }
}

export function handleQuestCompleted(event: QuestCompletedEvent): void {
  let quest = Quest.load(event.params.id.toString());
  if (quest) {
    quest.status = event.params.questStatus;
    quest.save();

    let creator = Creator.load(event.params.assignerAddress);
    if (creator) {
      creator.creator = event.params.assignerAddress;
      creator.totalXP = event.params.creatorXP;
      creator.isVerified = false;
      creator.save();
    } else {
      let creator = new Creator(event.params.assignerAddress);

      creator.id = event.params.assignerAddress;
      creator.creator = event.params.assignerAddress;
      creator.totalXP = event.params.creatorXP;
      creator.isVerified = false;
      creator.metadata = "undefined";
      creator.save();
    }
  }
}

export function handleQuestDeleted(event: QuestDeletedEvent): void {
  let quest = Quest.load(event.params.id.toString());
  if (quest) {
    quest.id = "0";
    quest.metadata = "0";
    quest.save();
  }
}

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let campaign = new Campaign(event.params.id.toString());

  campaign.id = event.params.id;
  campaign.creator = event.params.creator;
  campaign.metadata = event.params.metadata;
  campaign.totalAmount = event.params.totalAmount;
  campaign.donatedAmount = event.params.donatedAmount;
  campaign.totalDonors = event.params.totalDonors;
  campaign.status = event.params.status;
  campaign.xp = event.params.xp;

  campaign.save();
}

export function handleDonateToCampaign(event: DonateToCampaignEvent): void {
  let campaign = Campaign.load(event.params.id.toString());
  if (campaign) {
    campaign.donatedAmount = event.params.totalDonatedAmount;
    campaign.totalDonors = event.params.totalDonors;
    campaign.save();

    let donor = new Donor(event.params.id.toString());
    donor.id = event.params.id;
    donor.amount = event.params.donorAmount;
    donor.donor = event.params.donorAddress;
    donor.save();

    let creator = Creator.load(event.params.donorAddress);
    if (creator) {
      creator.creator = event.params.donorAddress;
      creator.totalXP = event.params.donorXP;
      creator.isVerified = false;
      creator.save();
    } else {
      let creator = new Creator(event.params.donorAddress);

      creator.id = event.params.donorAddress;
      creator.creator = event.params.donorAddress;
      creator.totalXP = event.params.donorXP;
      creator.isVerified = false;
      creator.metadata = "undefined";
      creator.save();
    }
  }
}

export function handleCampaignStatusChanged(
  event: CampaignStatusChangedEvent
): void {
  let campaign = Campaign.load(event.params.id.toString());
  if (campaign) {
    campaign.status = event.params.status;
    campaign.save();
  }
}

export function handleCampaignDeleted(event: CampaignDeletedEvent): void {
  let campaign = Campaign.load(event.params.id.toString());
  if (campaign) {
    campaign.id = "0";
    campaign.metadata = "0";
    campaign.save();
  }
}

export function handleCreatorMetadataChanged(
  event: CreatorMetadataChangedEvent
): void {
  let creator = Creator.load(event.params.creator);
  if (creator) {
    creator.creator = event.params.creator;
    creator.metadata = event.params.metadata;
    creator.save();
  } else {
    let creator = new Creator(event.params.creator);

    creator.creator = event.params.creator;
    creator.metadata = event.params.metadata;
    creator.save();
  }
}

export function handleCreatorVerified(event: CreatorVerifiedEvent): void {
  let creator = Creator.load(event.params.creator);
  if (creator) {
    creator.creator = event.params.creator;
    creator.isVerified = event.params.isVerified;
    creator.save();
  } else {
    let creator = new Creator(event.params.creator);

    creator.creator = event.params.creator;
    creator.isVerified = event.params.isVerified;
    creator.save();
  }
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {}
