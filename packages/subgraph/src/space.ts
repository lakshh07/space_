import {
  CampaignCreated as CampaignCreatedEvent,
  CampaignDeleted as CampaignDeletedEvent,
  CampaignStatusChanged as CampaignStatusChangedEvent,
  CreatorMetadataChanged as CreatorMetadataChangedEvent,
  CreatorVerified as CreatorVerifiedEvent,
  DonateToCampaign as DonateToCampaignEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  QuestAssigned as QuestAssignedEvent,
  QuestCompleted as QuestCompletedEvent,
  QuestCreated as QuestCreatedEvent,
  QuestDeleted as QuestDeletedEvent,
  QuestUserAdded as QuestUserAddedEvent
} from "../generated/space_/space_"
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
} from "../generated/schema"

export function handleCampaignCreated(event: CampaignCreatedEvent): void {
  let entity = new CampaignCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.creator = event.params.creator
  entity.metadata = event.params.metadata
  entity.totalAmount = event.params.totalAmount
  entity.donatedAmount = event.params.donatedAmount
  entity.totalDonors = event.params.totalDonors
  entity.status = event.params.status
  entity.xp = event.params.xp

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignDeleted(event: CampaignDeletedEvent): void {
  let entity = new CampaignDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCampaignStatusChanged(
  event: CampaignStatusChangedEvent
): void {
  let entity = new CampaignStatusChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreatorMetadataChanged(
  event: CreatorMetadataChangedEvent
): void {
  let entity = new CreatorMetadataChanged(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.metadata = event.params.metadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreatorVerified(event: CreatorVerifiedEvent): void {
  let entity = new CreatorVerified(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.isVerified = event.params.isVerified

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDonateToCampaign(event: DonateToCampaignEvent): void {
  let entity = new DonateToCampaign(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.totalDonatedAmount = event.params.totalDonatedAmount
  entity.donorAddress = event.params.donorAddress
  entity.donorXP = event.params.donorXP
  entity.donorAmount = event.params.donorAmount
  entity.totalDonors = event.params.totalDonors

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestAssigned(event: QuestAssignedEvent): void {
  let entity = new QuestAssigned(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.interestedUser = event.params.interestedUser

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestCompleted(event: QuestCompletedEvent): void {
  let entity = new QuestCompleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.assignerAddress = event.params.assignerAddress
  entity.questStatus = event.params.questStatus
  entity.creatorXP = event.params.creatorXP

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestCreated(event: QuestCreatedEvent): void {
  let entity = new QuestCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.creator = event.params.creator
  entity.metadata = event.params.metadata
  entity.amount = event.params.amount
  entity.status = event.params.status
  entity.xp = event.params.xp
  entity.assigned = event.params.assigned
  entity.interestedUsers = event.params.interestedUsers

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestDeleted(event: QuestDeletedEvent): void {
  let entity = new QuestDeleted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuestUserAdded(event: QuestUserAddedEvent): void {
  let entity = new QuestUserAdded(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.space__id = event.params.id
  entity.interestedUserAddresses = event.params.interestedUserAddresses
  entity.userComment = event.params.userComment

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
