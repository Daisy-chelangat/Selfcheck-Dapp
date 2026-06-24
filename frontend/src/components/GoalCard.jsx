import styled from "styled-components";
import {
  formatEth,
  formatDate,
  formatCountdown,
  getGoalStatus,
  getFrequencyLabel,
  calculateProgress,
} from "../utils/helpers";
import ProgressBar from "./ProgressBar";
import CheckInButton from "./CheckInButton";

const Card = styled.div`
  background: #1a1a2e;
  border: 1px solid ${(props) => {
    if (props.$status === "Completed") return "#22c55e";
    if (props.$status === "Failed") return "#ef4444";
    return "#2d2d5e";
  }};
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${(props) => {
      if (props.$status === "Completed") return "#22c55e";
      if (props.$status === "Failed") return "#ef4444";
      return "#6366f1";
    }};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const Description = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  flex: 1;
  margin-right: 12px;
  line-height: 1.4;
`;

const StatusBadge = styled.div`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => {
    if (props.$status === "Completed") return "#14532d";
    if (props.$status === "Failed") return "#7f1d1d";
    return "#1e1b4b";
  }};
  color: ${(props) => {
    if (props.$status === "Completed") return "#22c55e";
    if (props.$status === "Failed") return "#ef4444";
    return "#6366f1";
  }};
  white-space: nowrap;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div``;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 2px;
`;

const InfoValue = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: #ffffff;
`;

const PartnerBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #1e3a2f;
  color: #22c55e;
  border: 1px solid #22c55e;
  margin-bottom: 12px;
`;

const GoalCard = ({
  goal,
  isLoading,
  handleCheckIn,
  handleCompleteGoal,
  handleFailGoal,
}) => {
  const status = getGoalStatus(Number(goal.status));
  const progress = calculateProgress(goal.checkInCount, goal.requiredCheckIns);
  const isActive = status === "Active";
  const now = Math.floor(Date.now() / 1000);
  const isExpired = Number(goal.deadline) < now;

  return (
    <Card $status={status}>
      <CardHeader>
        <Description>{goal.description}</Description>
        <StatusBadge $status={status}>{status}</StatusBadge>
      </CardHeader>

      {goal.isPartnerGoal && (
        <PartnerBadge>🤝 Partner Goal</PartnerBadge>
      )}

      <ProgressBar progress={progress} status={status} />

      <InfoGrid>
        <InfoItem>
          <InfoLabel>Staked</InfoLabel>
          <InfoValue>{formatEth(goal.stake)} ETH</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Check-ins</InfoLabel>
          <InfoValue>
            {Number(goal.checkInCount)} / {Number(goal.requiredCheckIns)}
          </InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Frequency</InfoLabel>
          <InfoValue>{getFrequencyLabel(Number(goal.frequency))}</InfoValue>
        </InfoItem>
        <InfoItem>
          <InfoLabel>Deadline</InfoLabel>
          <InfoValue>{formatCountdown(goal.deadline)}</InfoValue>
        </InfoItem>
      </InfoGrid>

      {isActive && (
  <CheckInButton
    goalId={Number(goal.id)}
    isExpired={isExpired}
    isLoading={isLoading}
    checkInCount={Number(goal.checkInCount)}
    requiredCheckIns={Number(goal.requiredCheckIns)}
    lastCheckIn={Number(goal.lastCheckIn)}
    frequency={Number(goal.frequency)}
    isPartnerGoal={goal.isPartnerGoal}
    hasPendingRequest={false}
    handleCheckIn={handleCheckIn}
    handleCompleteGoal={handleCompleteGoal}
    handleFailGoal={handleFailGoal}
  />
)}
    </Card>
  );
};

export default GoalCard;