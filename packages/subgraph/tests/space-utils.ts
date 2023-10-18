import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CampaignCreated,
  CampaignDeleted,
  CampaignStatusChanged,
  CreatorMetadataChanged,
  CreatorVerified,
  DonateToCampaign,
  OwnershipTransferred,
  QuestAssigned,
  QuestCompleted,
  QuestCreated,
  QuestDeleted,
  QuestUserAdded
} from "../generated/Space_/Space_"

export function createCampaignCreatedEvent(
  id: string,
  creator: Address,
  metadata: string,
  totalAmount: BigInt,
  donatedAmount: BigInt,
  totalDonors: BigInt,
  status: boolean,
  xp: BigInt
): CampaignCreated {
  let campaignCreatedEvent = changetype<CampaignCreated>(newMockEvent())

  campaignCreatedEvent.parameters = new Array()

  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalAmount",
      ethereum.Value.fromUnsignedBigInt(totalAmount)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "donatedAmount",
      ethereum.Value.fromUnsignedBigInt(donatedAmount)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "totalDonors",
      ethereum.Value.fromUnsignedBigInt(totalDonors)
    )
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )
  campaignCreatedEvent.parameters.push(
    new ethereum.EventParam("xp", ethereum.Value.fromUnsignedBigInt(xp))
  )

  return campaignCreatedEvent
}

export function createCampaignDeletedEvent(id: string): CampaignDeleted {
  let campaignDeletedEvent = changetype<CampaignDeleted>(newMockEvent())

  campaignDeletedEvent.parameters = new Array()

  campaignDeletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )

  return campaignDeletedEvent
}

export function createCampaignStatusChangedEvent(
  id: string,
  status: boolean
): CampaignStatusChanged {
  let campaignStatusChangedEvent = changetype<CampaignStatusChanged>(
    newMockEvent()
  )

  campaignStatusChangedEvent.parameters = new Array()

  campaignStatusChangedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  campaignStatusChangedEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )

  return campaignStatusChangedEvent
}

export function createCreatorMetadataChangedEvent(
  creator: Address,
  metadata: string
): CreatorMetadataChanged {
  let creatorMetadataChangedEvent = changetype<CreatorMetadataChanged>(
    newMockEvent()
  )

  creatorMetadataChangedEvent.parameters = new Array()

  creatorMetadataChangedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  creatorMetadataChangedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )

  return creatorMetadataChangedEvent
}

export function createCreatorVerifiedEvent(
  creator: Address,
  isVerified: boolean
): CreatorVerified {
  let creatorVerifiedEvent = changetype<CreatorVerified>(newMockEvent())

  creatorVerifiedEvent.parameters = new Array()

  creatorVerifiedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  creatorVerifiedEvent.parameters.push(
    new ethereum.EventParam(
      "isVerified",
      ethereum.Value.fromBoolean(isVerified)
    )
  )

  return creatorVerifiedEvent
}

export function createDonateToCampaignEvent(
  id: string,
  totalDonatedAmount: BigInt,
  donorAddress: Address,
  donorXP: BigInt,
  donorAmount: BigInt,
  totalDonors: BigInt
): DonateToCampaign {
  let donateToCampaignEvent = changetype<DonateToCampaign>(newMockEvent())

  donateToCampaignEvent.parameters = new Array()

  donateToCampaignEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  donateToCampaignEvent.parameters.push(
    new ethereum.EventParam(
      "totalDonatedAmount",
      ethereum.Value.fromUnsignedBigInt(totalDonatedAmount)
    )
  )
  donateToCampaignEvent.parameters.push(
    new ethereum.EventParam(
      "donorAddress",
      ethereum.Value.fromAddress(donorAddress)
    )
  )
  donateToCampaignEvent.parameters.push(
    new ethereum.EventParam(
      "donorXP",
      ethereum.Value.fromUnsignedBigInt(donorXP)
    )
  )
  donateToCampaignEvent.parameters.push(
    new ethereum.EventParam(
      "donorAmount",
      ethereum.Value.fromUnsignedBigInt(donorAmount)
    )
  )
  donateToCampaignEvent.parameters.push(
    new ethereum.EventParam(
      "totalDonors",
      ethereum.Value.fromUnsignedBigInt(totalDonors)
    )
  )

  return donateToCampaignEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent = changetype<OwnershipTransferred>(
    newMockEvent()
  )

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createQuestAssignedEvent(
  id: string,
  interestedUser: Address
): QuestAssigned {
  let questAssignedEvent = changetype<QuestAssigned>(newMockEvent())

  questAssignedEvent.parameters = new Array()

  questAssignedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  questAssignedEvent.parameters.push(
    new ethereum.EventParam(
      "interestedUser",
      ethereum.Value.fromAddress(interestedUser)
    )
  )

  return questAssignedEvent
}

export function createQuestCompletedEvent(
  id: string,
  assignerAddress: Address,
  questStatus: boolean,
  creatorXP: BigInt
): QuestCompleted {
  let questCompletedEvent = changetype<QuestCompleted>(newMockEvent())

  questCompletedEvent.parameters = new Array()

  questCompletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "assignerAddress",
      ethereum.Value.fromAddress(assignerAddress)
    )
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "questStatus",
      ethereum.Value.fromBoolean(questStatus)
    )
  )
  questCompletedEvent.parameters.push(
    new ethereum.EventParam(
      "creatorXP",
      ethereum.Value.fromUnsignedBigInt(creatorXP)
    )
  )

  return questCompletedEvent
}

export function createQuestCreatedEvent(
  id: string,
  creator: Address,
  metadata: string,
  amount: BigInt,
  status: boolean,
  xp: BigInt,
  assigned: Address,
  interestedUsers: string
): QuestCreated {
  let questCreatedEvent = changetype<QuestCreated>(newMockEvent())

  questCreatedEvent.parameters = new Array()

  questCreatedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam("status", ethereum.Value.fromBoolean(status))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam("xp", ethereum.Value.fromUnsignedBigInt(xp))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam("assigned", ethereum.Value.fromAddress(assigned))
  )
  questCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "interestedUsers",
      ethereum.Value.fromString(interestedUsers)
    )
  )

  return questCreatedEvent
}

export function createQuestDeletedEvent(id: string): QuestDeleted {
  let questDeletedEvent = changetype<QuestDeleted>(newMockEvent())

  questDeletedEvent.parameters = new Array()

  questDeletedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )

  return questDeletedEvent
}

export function createQuestUserAddedEvent(
  id: string,
  interestedUserAddresses: string,
  userComment: string
): QuestUserAdded {
  let questUserAddedEvent = changetype<QuestUserAdded>(newMockEvent())

  questUserAddedEvent.parameters = new Array()

  questUserAddedEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromString(id))
  )
  questUserAddedEvent.parameters.push(
    new ethereum.EventParam(
      "interestedUserAddresses",
      ethereum.Value.fromString(interestedUserAddresses)
    )
  )
  questUserAddedEvent.parameters.push(
    new ethereum.EventParam(
      "userComment",
      ethereum.Value.fromString(userComment)
    )
  )

  return questUserAddedEvent
}
