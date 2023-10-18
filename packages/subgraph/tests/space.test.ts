import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { Address, BigInt } from "@graphprotocol/graph-ts"
import { CampaignCreated } from "../generated/schema"
import { CampaignCreated as CampaignCreatedEvent } from "../generated/Space_/Space_"
import { handleCampaignCreated } from "../src/space"
import { createCampaignCreatedEvent } from "./space-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = "Example string value"
    let creator = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let metadata = "Example string value"
    let totalAmount = BigInt.fromI32(234)
    let donatedAmount = BigInt.fromI32(234)
    let totalDonors = BigInt.fromI32(234)
    let status = "boolean Not implemented"
    let xp = BigInt.fromI32(234)
    let newCampaignCreatedEvent = createCampaignCreatedEvent(
      id,
      creator,
      metadata,
      totalAmount,
      donatedAmount,
      totalDonors,
      status,
      xp
    )
    handleCampaignCreated(newCampaignCreatedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("CampaignCreated created and stored", () => {
    assert.entityCount("CampaignCreated", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "creator",
      "0x0000000000000000000000000000000000000001"
    )
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "metadata",
      "Example string value"
    )
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalAmount",
      "234"
    )
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "donatedAmount",
      "234"
    )
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "totalDonors",
      "234"
    )
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "status",
      "boolean Not implemented"
    )
    assert.fieldEquals(
      "CampaignCreated",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "xp",
      "234"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
