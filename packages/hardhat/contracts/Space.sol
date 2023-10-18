// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

library SafeMath {
    function add(uint256 x, uint256 y) internal pure returns (uint256 z) {
        require((z = x + y) >= x, "ds-math-add-overflow");
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        unchecked {
            require(b <= a);
            return a - b;
        }
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        unchecked {
            require(b > 0);
            return a / b;
        }
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        return a * b;
    }
}

library Counters {
    struct Counter {
        uint256 _value; // default: 0
    }

    function current(Counter storage counter) internal view returns (uint256) {
        return counter._value;
    }

    function increment(Counter storage counter) internal {
        unchecked {
            counter._value += 1;
        }
    }

    function decrement(Counter storage counter) internal {
        uint256 value = counter._value;
        require(value > 0, "Counter: decrement overflow");
        unchecked {
            counter._value = value - 1;
        }
    }

    function reset(Counter storage counter) internal {
        counter._value = 0;
    }
}

contract Space_ is Ownable, ReentrancyGuard {
    using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _questsCount;
    Counters.Counter private _campaignsCount;
    Counters.Counter private _donorsListCount;
    uint256 private _systemFee = 1;

    struct Creator {
        address creator;
        bool isVerified;
        string metadata;
        uint256 totalXP;
    }

    struct Campaign {
        string id;
        address creator;
        string metadata;
        uint256 totalAmount;
        uint256 donatedAmount;
        uint256 totalDonors;
        bool status;
        uint256 xp;
    }

    struct Quest {
        string id;
        address creator;
        string metadata;
        uint256 amount;
        bool status;
        uint256 xp;
        address assigned;
        string interestedUsers;
    }

    struct Donor {
        string id;
        address donor;
        uint256 amount;
    }

    constructor(address initialOwner) Ownable(initialOwner) {}

    event QuestCreated(
        string id,
        address creator,
        string metadata, //title, description, duration
        uint256 amount,
        bool status,
        uint256 xp,
        address assigned,
        string interestedUsers
    );

    event QuestUserAdded(
        string id,
        string interestedUserAddresses,
        string userComment
    );

    event QuestAssigned(string id, address interestedUser);

    event QuestCompleted(
        string id,
        address assignerAddress,
        bool questStatus,
        uint256 creatorXP
    );

    event CampaignCreated(
        string id,
        address creator,
        string metadata,
        uint256 totalAmount,
        uint256 donatedAmount,
        uint256 totalDonors,
        bool status,
        uint256 xp
    );

    event DonateToCampaign(
        string id,
        uint256 totalDonatedAmount,
        address donorAddress,
        uint256 donorXP,
        uint256 donorAmount,
        uint256 totalDonors
    );

    event CampaignStatusChanged(string id, bool status);

    event QuestDeleted(string id);

    event CampaignDeleted(string id);

    event CreatorMetadataChanged(address creator, string metadata);

    event CreatorVerified(address creator, bool isVerified);

    mapping(address => Creator) addressToCreator;
    mapping(uint256 => Quest) idToQuest;
    mapping(uint256 => Campaign) idToCampaign;
    mapping(uint256 => mapping(uint256 => Donor)) idToDonor;
    mapping(uint256 => mapping(address => string)) interstedUserComments;

    function createQuest(
        string memory _id,
        string memory _metadata,
        address _creator,
        uint256 _amount,
        uint256 _xp
    ) external nonReentrant {
        require(bytes(_id).length > 0, "id required");
        require(bytes(_metadata).length > 0, "metadata required");
        require(_amount >= 0, "amount cannot be less than zero");
        require(_xp >= 0, "amount cannot be less than zero");

        _questsCount.increment();
        uint256 questCount = _questsCount.current();

        uint256 systemCut = _amount.mul(_systemFee).div(100);

        idToQuest[questCount] = Quest(
            _id,
            _creator,
            _metadata,
            _amount.add(systemCut),
            false,
            _xp,
            address(0),
            ""
        );

        emit QuestCreated(
            _id,
            _creator,
            _metadata,
            _amount.add(systemCut),
            false,
            _xp,
            address(0),
            ""
        );
    }

    function addQuestUser(
        uint256 _questId,
        string memory _interestedUserAddresses,
        address _interestedUserAddress,
        string memory _userComment
    ) external nonReentrant {
        idToQuest[_questId].interestedUsers = _interestedUserAddresses;
        interstedUserComments[_questId][_interestedUserAddress] = _userComment;

        emit QuestUserAdded(
            idToQuest[_questId].id,
            _interestedUserAddresses,
            _userComment
        );
    }

    function approveQuestInterestedUser(
        uint256 _id,
        address _interestedUser
    ) external nonReentrant {
        idToQuest[_id].assigned = _interestedUser;

        emit QuestAssigned(idToQuest[_id].id, _interestedUser);
    }

    function questComplete(uint256 _id) external payable nonReentrant {
        require(
            msg.value == idToQuest[_id].amount,
            "Amount should be same as mentioned in quest"
        );

        address assignedUser = idToQuest[_id].assigned;

        uint256 systemCut = msg.value.mul(_systemFee).div(100);

        (bool fees, ) = owner().call{value: systemCut}("");
        require(fees, "Failed to transfer system fees");

        (bool sent, ) = assignedUser.call{value: msg.value.sub(systemCut)}("");
        require(sent, "Failed to transfer amoun to assigned user");

        idToQuest[_id].status = true;
        addressToCreator[assignedUser].creator = assignedUser;
        addressToCreator[assignedUser].totalXP = addressToCreator[assignedUser]
            .totalXP
            .add(idToQuest[_id].xp);

        emit QuestCompleted(
            idToQuest[_id].id,
            assignedUser,
            true,
            addressToCreator[assignedUser].totalXP
        );
    }

    function createCampaign(
        string memory _id,
        string memory _metadata,
        address _creator,
        uint256 _totalAmount,
        uint256 _xp
    ) external nonReentrant {
        require(bytes(_id).length > 0, "id required");
        require(bytes(_metadata).length > 0, "metadata required");
        require(_totalAmount >= 0, "amount cannot be less than zero");
        require(_xp >= 0, "amount cannot be less than zero");

        _campaignsCount.increment();
        uint256 campaignCount = _campaignsCount.current();

        idToCampaign[campaignCount] = Campaign(
            _id,
            _creator,
            _metadata,
            _totalAmount,
            0,
            0,
            false,
            _xp
        );

        emit CampaignCreated(
            _id,
            _creator,
            _metadata,
            _totalAmount,
            0,
            0,
            false,
            _xp
        );
    }

    function donateToCampaign(uint256 _id) external payable nonReentrant {
        require(msg.value > 0, "amount should be greater than 0");
        require(
            msg.value <= idToCampaign[_id].totalAmount,
            "amount should not be greater than the total amount"
        );

        uint256 systemCut = msg.value.mul(_systemFee).div(100);

        (bool fees, ) = owner().call{value: systemCut}("");
        require(fees, "Failed to transfer system fees");

        (bool sent, ) = idToCampaign[_id].creator.call{
            value: msg.value.sub(systemCut)
        }("");
        require(sent, "Failed to transfer amount to creator");

        idToCampaign[_id].totalDonors = idToCampaign[_id].totalDonors.add(1);
        idToCampaign[_id].donatedAmount = idToCampaign[_id].donatedAmount.add(
            msg.value.sub(systemCut)
        );

        idToDonor[_id][idToCampaign[_id].totalDonors] = Donor(
            idToCampaign[_id].id,
            msg.sender,
            msg.value.sub(systemCut)
        );

        addressToCreator[msg.sender].totalXP = addressToCreator[msg.sender]
            .totalXP
            .add(idToCampaign[_id].xp);

        addressToCreator[msg.sender].creator = msg.sender;

        emit DonateToCampaign(
            idToCampaign[_id].id,
            idToCampaign[_id].donatedAmount,
            msg.sender,
            addressToCreator[msg.sender].totalXP.add(idToCampaign[_id].xp),
            msg.value.sub(systemCut),
            idToCampaign[_id].totalDonors
        );
    }

    function changeCampaignStatus(uint256 _id) external nonReentrant {
        require(msg.sender == idToCampaign[_id].creator);

        idToCampaign[_id].status = true;

        emit CampaignStatusChanged(idToCampaign[_id].id, true);
    }

    function deleteQuest(uint256 _id) external nonReentrant {
        delete idToQuest[_id];

        emit QuestDeleted(idToQuest[_id].id);
    }

    function deleteCamapign(uint256 _id) external nonReentrant {
        delete idToCampaign[_id];

        emit CampaignDeleted(idToCampaign[_id].id);
    }

    function changeProfileMetadata(
        string memory _metadata,
        address _creator
    ) external nonReentrant {
        addressToCreator[_creator].metadata = _metadata;

        emit CreatorMetadataChanged(_creator, _metadata);
    }

    function changeCreatorVerification(address _creator) external nonReentrant {
        addressToCreator[_creator].isVerified = true;

        emit CreatorVerified(_creator, true);
    }

    function changeSystemFee(
        uint256 _newSystemFee
    ) external nonReentrant onlyOwner {
        _systemFee = _newSystemFee;
    }

    function fetchCreatorsDetails(
        address _creator
    ) external view returns (Creator memory) {
        return addressToCreator[_creator];
    }

    function fetchInterestedUserComment(
        uint256 _questId,
        address _interestedUserAddress
    ) external view returns (string memory) {
        return interstedUserComments[_questId][_interestedUserAddress];
    }

    function getDonors(uint256 _id) external view returns (Donor[] memory) {
        uint256 totalDonorCount = idToCampaign[_id].totalDonors;
        uint256 currentIndex = 0;

        Donor[] memory donor = new Donor[](totalDonorCount);

        for (uint256 i = 0; i < totalDonorCount; i++) {
            uint256 currentNumber = i.add(1);
            Donor storage currentDonor = idToDonor[_id][currentNumber];
            donor[currentIndex] = currentDonor;
            currentIndex += 1;
        }
        return donor;
    }

    function fetchQuests() external view returns (Quest[] memory) {
        uint256 totalQuestCount = _questsCount.current();
        uint256 currentIndex = 0;

        Quest[] memory quest = new Quest[](totalQuestCount);

        for (uint256 i = 0; i < totalQuestCount; i++) {
            uint256 currentNumber = i.add(1);
            Quest storage currentQuest = idToQuest[currentNumber];
            quest[currentIndex] = currentQuest;
            currentIndex += 1;
        }
        return quest;
    }

    function fetchCampaign(
        uint256 _id
    ) external view returns (Campaign memory) {
        return idToCampaign[_id];
    }

    function fetchCampaigns() external view returns (Campaign[] memory) {
        uint256 totalCampaignCount = _campaignsCount.current();
        uint256 currentIndex = 0;

        Campaign[] memory campaign = new Campaign[](totalCampaignCount);

        for (uint256 i = 0; i < totalCampaignCount; i++) {
            uint256 currentNumber = i.add(1);
            Campaign storage currentCampaign = idToCampaign[currentNumber];
            campaign[currentIndex] = currentCampaign;
            currentIndex += 1;
        }
        return campaign;
    }
}
