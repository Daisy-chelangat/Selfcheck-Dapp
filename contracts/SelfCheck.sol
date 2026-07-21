// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SelfCheck {

    // ─── ENUMS ───────────────────────────────────────

    enum GoalStatus { Active, Completed, Failed }

    enum CheckInFrequency { Daily, TwoDays, Weekly }

    enum GoalCategory { 
        Learning,
        Fitness,
        Health,
        Reading,
        Finance,
        Prayer,
        PersonalDevelopment,
        Other
    }

    // ─── STRUCTS ──────────────────────────────────────

    struct Goal {
        uint id;
        address owner;
        string description;
        uint stake;
        uint deadline;
        uint createdAt;
        uint lastCheckIn;
        uint checkInCount;
        uint requiredCheckIns;
        CheckInFrequency frequency;
        GoalStatus status;
        bool isPartnerGoal;
        GoalCategory category;
        uint[] checkInHistory;
    }

    struct PartnerGoal {
        uint goalId;
        address initiator;
        address partner;
        uint initiatorStake;
        uint partnerStake;
        bool partnerAccepted;
        bool initiatorCompleted;
        bool partnerCompleted;
    }

    struct CheckInRequest {
        uint goalId;
        address requester;
        uint timestamp;
        bool approved;
        bool rejected;
        bool pending;
    }

    // ─── STATE VARIABLES ─────────────────────────────

    address public owner;
    uint public goalCounter;
    uint public partnerGoalCounter;
    uint public communityPool;
    uint public treasury;

    mapping(uint => Goal) public goals;
    mapping(address => uint[]) public userGoals;
    mapping(uint => PartnerGoal) public partnerGoals;
    mapping(address => uint) public successCount;
    mapping(uint => CheckInRequest) public checkInRequests;
    mapping(uint => uint) public pendingCheckInGoalId;
    mapping(uint => uint) public goalToPartnerGoalId;

    // ─── EVENTS ──────────────────────────────────────

    event GoalCreated(
        uint indexed goalId,
        address indexed owner,
        string description,
        uint stake,
        uint deadline
    );

    event CheckedIn(
        uint indexed goalId,
        address indexed owner,
        uint timestamp,
        uint checkInCount
    );

    event GoalCompleted(
        uint indexed goalId,
        address indexed owner,
        uint stakeReturned
    );

    event GoalFailed(
        uint indexed goalId,
        address indexed owner,
        uint stakeLost
    );

    event PartnerGoalCreated(
        uint indexed partnerGoalId,
        address indexed initiator,
        address indexed partner
    );

    event PartnerGoalAccepted(
        uint indexed partnerGoalId,
        address indexed partner
    );

    event PartnerGoalResolved(
        uint indexed partnerGoalId,
        address winner,
        address loser
    );

    event PoolDistributed(
        uint totalAmount,
        uint timestamp
    );

    event CheckInRequested(
        uint indexed goalId,
        address indexed requester,
        uint timestamp
    );

    event CheckInApproved(
        uint indexed goalId,
        address indexed partner,
        uint timestamp
    );

    event CheckInRejected(
        uint indexed goalId,
        address indexed partner,
        uint timestamp
    );

    // ─── MODIFIERS ───────────────────────────────────

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier goalExists(uint goalId) {
        require(goalId < goalCounter, "Goal does not exist");
        _;
    }

    modifier onlyGoalOwner(uint goalId) {
        require(goals[goalId].owner == msg.sender, "Not goal owner");
        _;
    }

    modifier isActive(uint goalId) {
        require(goals[goalId].status == GoalStatus.Active, "Goal is not active");
        _;
    }

    // ─── CONSTRUCTOR ─────────────────────────────────

    constructor() {
        owner = msg.sender;
        goalCounter = 0;
        partnerGoalCounter = 0;
        communityPool = 0;
        treasury = 0;
    }

    // ─── HELPERS ─────────────────────────────────────

    function getFrequencyInSeconds(CheckInFrequency frequency)
        internal
        pure
        returns (uint)
    {
        if (frequency == CheckInFrequency.Daily) return 1 days;
        if (frequency == CheckInFrequency.TwoDays) return 2 days;
        return 7 days;
    }

    function calculateRequiredCheckIns(
        uint deadline,
        uint createdAt,
        CheckInFrequency frequency
    ) internal pure returns (uint) {
        uint duration = deadline - createdAt;
        uint frequencySeconds = getFrequencyInSeconds(frequency);
        return duration / frequencySeconds;
    }

    // ─── SOLO MODE FUNCTIONS ──────────────────────────

    function createSoloGoal(
        string memory description,
        uint durationInDays,
        CheckInFrequency frequency ,
        GoalCategory category
    ) external payable {
        require(msg.value > 0, "Must stake some ETH");
        require(durationInDays > 0, "Duration must be greater than 0");
        require(bytes(description).length > 0, "Description cannot be empty");

        uint deadline = block.timestamp + (durationInDays * 1 days);

        uint required = calculateRequiredCheckIns(
            deadline,
            block.timestamp,
            frequency
        );

        require(required > 0, "Goal duration too short for frequency");

        goals[goalCounter] = Goal({
            id: goalCounter,
            owner: msg.sender,
            description: description,
            stake: msg.value,
            deadline: deadline,
            createdAt: block.timestamp,
            lastCheckIn: 0,
            checkInCount: 0,
            requiredCheckIns: required,
            frequency: frequency,
            status: GoalStatus.Active,
            isPartnerGoal: false,
            category : category,
            checkInHistory: new uint[](0)   
        });

        userGoals[msg.sender].push(goalCounter);

        emit GoalCreated(
            goalCounter,
            msg.sender,
            description,
            msg.value,
            deadline
        );

        goalCounter++;
    }

   function checkIn(uint goalId)
        external
        goalExists(goalId)
        onlyGoalOwner(goalId)
        isActive(goalId)
    {
        Goal storage goal = goals[goalId];

        require(block.timestamp <= goal.deadline, "Goal has expired");

        uint frequencySeconds = getFrequencyInSeconds(goal.frequency);

        if (goal.lastCheckIn != 0) {
            require(
                block.timestamp >= goal.lastCheckIn + frequencySeconds,
                "Too early to check in"
            );
        }

        // if partner goal → create a pending request instead
        if (goal.isPartnerGoal) {
            require(
                !checkInRequests[goalId].pending,
                "Check-in request already pending"
            );

            checkInRequests[goalId] = CheckInRequest({
                goalId: goalId,
                requester: msg.sender,
                timestamp: block.timestamp,
                approved: false,
                rejected: false,
                pending: true
            });

            emit CheckInRequested(goalId, msg.sender, block.timestamp);
        } else {
            // solo goal → record immediately
            goal.lastCheckIn = block.timestamp;
            goal.checkInCount++;
            goal.checkInHistory.push(block.timestamp);

            emit CheckedIn(goalId, msg.sender, block.timestamp, goal.checkInCount);
        }
    }

    function approveCheckIn(uint goalId) external goalExists(goalId) isActive(goalId) {
        Goal storage goal = goals[goalId];
        CheckInRequest storage request = checkInRequests[goalId];

        require(request.pending, "No pending check-in request");
        require(!request.approved && !request.rejected, "Request already resolved");

        uint pgId = goalToPartnerGoalId[goalId];
        PartnerGoal storage pg = partnerGoals[pgId];

        require(
            msg.sender == pg.partner || msg.sender == pg.initiator,
            "Not a partner on this goal"
        );
        require(msg.sender != request.requester, "Cannot approve your own check-in");

        request.approved = true;
        request.pending = false;

        goal.lastCheckIn = request.timestamp;
        goal.checkInCount++;
        goal.checkInHistory.push(request.timestamp);

        emit CheckInApproved(goalId, msg.sender, block.timestamp);
        emit CheckedIn(goalId, request.requester, request.timestamp, goal.checkInCount);
    }

    function rejectCheckIn(uint goalId) external goalExists(goalId) isActive(goalId) {
        CheckInRequest storage request = checkInRequests[goalId];

        require(request.pending, "No pending check-in request");
        require(!request.approved && !request.rejected, "Request already resolved");

        uint pgId = goalToPartnerGoalId[goalId];
        PartnerGoal storage pg = partnerGoals[pgId];

        require(
            msg.sender == pg.partner || msg.sender == pg.initiator,
            "Not a partner on this goal"
        );
        require(msg.sender != request.requester, "Cannot reject your own check-in");

        request.rejected = true;
        request.pending = false;

        emit CheckInRejected(goalId, msg.sender, block.timestamp);
    }

    function autoApproveCheckIn(uint goalId) external goalExists(goalId) isActive(goalId) {
        Goal storage goal = goals[goalId];
        CheckInRequest storage request = checkInRequests[goalId];

        require(request.pending, "No pending check-in request");
        require(!request.approved && !request.rejected, "Request already resolved");
        require(
            block.timestamp >= request.timestamp + 24 hours,
            "Must wait 24 hours for auto-approve"
        );

        request.approved = true;
        request.pending = false;

        goal.lastCheckIn = request.timestamp;
        goal.checkInCount++;

        emit CheckInApproved(goalId, address(0), block.timestamp);
        emit CheckedIn(goalId, request.requester, request.timestamp, goal.checkInCount);
    }

    function getCheckInRequest(uint goalId) external view returns (CheckInRequest memory) {
        return checkInRequests[goalId];
    }

    function completeGoal(uint goalId)
        external
        goalExists(goalId)
        onlyGoalOwner(goalId)
        isActive(goalId)
    {
        Goal storage goal = goals[goalId];

        require(block.timestamp >= goal.deadline, "Goal deadline not reached yet");

        uint minRequired = (goal.requiredCheckIns * 80) / 100;
        require(goal.checkInCount >= minRequired, "Not enough check-ins to complete");

        goal.status = GoalStatus.Completed;
        successCount[msg.sender]++;

        uint stakeAmount = goal.stake;
        goal.stake = 0;

        (bool sent, ) = payable(msg.sender).call{value: stakeAmount}("");
        require(sent, "Failed to return stake");

        emit GoalCompleted(goalId, msg.sender, stakeAmount);
    }

    function failGoal(uint goalId)
        external
        goalExists(goalId)
        isActive(goalId)
    {
        Goal storage goal = goals[goalId];

        require(block.timestamp > goal.deadline, "Goal deadline not reached yet");

        uint minRequired = (goal.requiredCheckIns * 80) / 100;
        require(goal.checkInCount < minRequired, "Goal can be completed not failed");

        goal.status = GoalStatus.Failed;

        uint stakeLost = goal.stake;
        goal.stake = 0;

        uint toTreasury = (stakeLost * 5) / 100;
        uint toPool = stakeLost - toTreasury;

        treasury += toTreasury;
        communityPool += toPool;

        emit GoalFailed(goalId, goal.owner, stakeLost);
    }

    // ─── PARTNER MODE FUNCTIONS ───────────────────────

    function createPartnerGoal(
        string memory description,
        uint durationInDays,
        CheckInFrequency frequency,
        GoalCategory category,
        address partner
    ) external payable {
        require(msg.value > 0, "Must stake some ETH");
        require(durationInDays > 0, "Duration must be greater than 0");
        require(bytes(description).length > 0, "Description cannot be empty");
        require(partner != address(0), "Invalid partner address");
        require(partner != msg.sender, "Cannot partner with yourself");

        uint deadline = block.timestamp + (durationInDays * 1 days);

        uint required = calculateRequiredCheckIns(
            deadline,
            block.timestamp,
            frequency
        );

        require(required > 0, "Goal duration too short for frequency");

        goals[goalCounter] = Goal({
            id: goalCounter,
            owner: msg.sender,
            description: description,
            stake: msg.value,
            deadline: deadline,
            createdAt: block.timestamp,
            lastCheckIn: 0,
            checkInCount: 0,
            requiredCheckIns: required,
            frequency: frequency,
            status: GoalStatus.Active,
            isPartnerGoal: true,
            category: category,
            checkInHistory: new uint[](0)
        });

        partnerGoals[partnerGoalCounter] = PartnerGoal({
            goalId: goalCounter,
            initiator: msg.sender,
            partner: partner,
            initiatorStake: msg.value,
            partnerStake: 0,
            partnerAccepted: false,
            initiatorCompleted: false,
            partnerCompleted: false
        });

        userGoals[msg.sender].push(goalCounter);

        emit PartnerGoalCreated(partnerGoalCounter, msg.sender, partner);
        
        goalToPartnerGoalId[goalCounter] = partnerGoalCounter;
        goalCounter++;
        partnerGoalCounter++;
    }

    function acceptPartnerGoal(uint partnerGoalId) external payable {
        PartnerGoal storage pg = partnerGoals[partnerGoalId];

        require(pg.partner == msg.sender, "Not the invited partner");
        require(!pg.partnerAccepted, "Already accepted");
        require(msg.value == pg.initiatorStake, "Must match initiator stake");

        Goal storage goal = goals[pg.goalId];
        require(block.timestamp < goal.deadline, "Goal already expired");

        pg.partnerAccepted = true;
        pg.partnerStake = msg.value;

        userGoals[msg.sender].push(pg.goalId);

        emit PartnerGoalAccepted(partnerGoalId, msg.sender);
    }

    function resolvePartnerGoal(uint partnerGoalId) external {
        PartnerGoal storage pg = partnerGoals[partnerGoalId];
        Goal storage goal = goals[pg.goalId];

        require(pg.partnerAccepted, "Partner has not accepted yet");
        require(goal.status == GoalStatus.Active, "Goal already resolved");
        require(block.timestamp > goal.deadline, "Deadline not reached yet");

        uint minRequired = (goal.requiredCheckIns * 80) / 100;

        pg.initiatorCompleted = goal.checkInCount >= minRequired;

        goal.status = GoalStatus.Completed;

        uint totalStake = pg.initiatorStake + pg.partnerStake;

        if (pg.initiatorCompleted && pg.partnerCompleted) {
            // both succeeded → return stakes + share pool bonus
            successCount[pg.initiator]++;
            successCount[pg.partner]++;

            (bool s1, ) = payable(pg.initiator).call{value: pg.initiatorStake}("");
            require(s1, "Failed to return initiator stake");

            (bool s2, ) = payable(pg.partner).call{value: pg.partnerStake}("");
            require(s2, "Failed to return partner stake");

            emit PartnerGoalResolved(partnerGoalId, address(0), address(0));

        } else if (pg.initiatorCompleted && !pg.partnerCompleted) {
            // initiator wins
            successCount[pg.initiator]++;

            uint toTreasury = (pg.partnerStake * 5) / 100;
            uint winnings = pg.partnerStake - toTreasury;
            treasury += toTreasury;

            (bool sent, ) = payable(pg.initiator).call{value: pg.initiatorStake + winnings}("");
            require(sent, "Failed to send winnings");

            emit PartnerGoalResolved(partnerGoalId, pg.initiator, pg.partner);

        } else if (!pg.initiatorCompleted && pg.partnerCompleted) {
            // partner wins
            successCount[pg.partner]++;

            uint toTreasury = (pg.initiatorStake * 5) / 100;
            uint winnings = pg.initiatorStake - toTreasury;
            treasury += toTreasury;

            (bool sent, ) = payable(pg.partner).call{value: pg.partnerStake + winnings}("");
            require(sent, "Failed to send winnings");

            emit PartnerGoalResolved(partnerGoalId, pg.partner, pg.initiator);

        } else {
            // both failed → all goes to community pool
            uint toTreasury = (totalStake * 5) / 100;
            uint toPool = totalStake - toTreasury;
            treasury += toTreasury;
            communityPool += toPool;

            emit PartnerGoalResolved(partnerGoalId, address(0), address(0));
        }
    }

    // ─── POOL FUNCTIONS ───────────────────────────────

    function distributePool() external onlyOwner {
        require(communityPool > 0, "Pool is empty");

        uint amount = communityPool;
        communityPool = 0;

        emit PoolDistributed(amount, block.timestamp);
    }

    function withdrawTreasury() external onlyOwner {
        require(treasury > 0, "Treasury is empty");

        uint amount = treasury;
        treasury = 0;

        (bool sent, ) = payable(owner).call{value: amount}("");
        require(sent, "Failed to withdraw treasury");
    }

    // ─── VIEW FUNCTIONS ───────────────────────────────

    function getGoal(uint goalId) external view returns (Goal memory) {
        return goals[goalId];
    }

    function getUserGoals(address user) external view returns (uint[] memory) {
        return userGoals[user];
    }

    function getPartnerGoal(uint partnerGoalId) external view returns (PartnerGoal memory) {
        return partnerGoals[partnerGoalId];
    }

    function getPoolBalance() external view returns (uint) {
        return communityPool;
    }

    function getTreasuryBalance() external view returns (uint) {
        return treasury;
    }

    function getSuccessCount(address user) external view returns (uint) {
        return successCount[user];
    }
    function getCheckInHistory(uint goalId) external view returns (uint[] memory) {
        return goals[goalId].checkInHistory;
    }

}