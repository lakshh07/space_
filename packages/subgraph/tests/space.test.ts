import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address } from "@graphprotocol/graph-ts"
import { AssignersAdded } from "../generated/schema"
import { AssignersAdded as AssignersAddedEvent } from "../generated/Space_/Space_"
import { handleAssignersAdded } from "../src/space"
import { createAssignersAddedEvent } from "./space-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let id = BigInt.fromI32(234)
    let assignerList = Address.fromString(
      "0x0000000000000000000000000000000000000001"
    )
    let newAssignersAddedEvent = createAssignersAddedEvent(id, assignerList)
    handleAssignersAdded(newAssignersAddedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("AssignersAdded created and stored", () => {
    assert.entityCount("AssignersAdded", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "AssignersAdded",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "assignerList",
      "0x0000000000000000000000000000000000000001"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
