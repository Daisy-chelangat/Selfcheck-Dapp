import { useState, useEffect } from "react";
import styled from "styled-components";
import { formatEth, formatAddress, formatCountdown, getGoalStatus } from "../utils/helpers";
import ProgressBar from "./ProgressBar";

const Card = styled.div`
  background: #1a1a2e;
  border: 1px solid #22c55e;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(34, 197, 94, 0.1);
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
`;

const Badge = styled.div`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: #1e3a2f;
  color: #22c55e;
  border: 1px solid #22c55e;
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

const PendingBox = styled.div`
  background: #1e1b4b;
  border: 1px solid #6366f1;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  font-size: 0.85rem;
  color: #94a3b8;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Button = styled.button`
  flex: 1;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AcceptButton = styled(Button)`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  }
`;

const ResolveButton = styled(Button)`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }
`;

const PartnerInvite = ({
  goal,
  account,
  isLoading,
  getPartnerGoal,
  handleAcceptPartnerGoal,
  handleResolvePartnerGoal,
}) => {
  const [partnerGoal, setPartnerGoal] = useState(null);
  const [pgIndex, setPgIndex] = useState(null);

  useEffect(() => {
    const fetchPartnerGoal = async () => {
      if (!getPartnerGoal) return;
      try {
        const pg = await getPartnerGoal(Number(goal.id));
        setPartnerGoal(pg);
        setPgIndex(Number(goal.id));
      } catch (err) {
        console.error("Failed to fetch partner goal:", err);
      }
    };
    fetchPartnerGoal();
  }, [goal.id]);

  const status = getGoalStatus(Number(goal.status));
  const now = Math.floor(Date.now() / 1000);
  const isExpired = Number(goal.deadline) < now;
  const isPartner = partnerGoal && 
    partnerGoal.partner.toLowerCase() === account.toLowerCase();
  const isPending = partnerGoal && !partnerGoal.partnerAccepted;
  const canResolve = isExpired && partnerGoal && partnerGoal.partnerAccepted;

  return (
    <Card>
      <CardHeader>
        <Description>{goal.description}</Description>
        <Badge>🤝 Partner</Badge>
      </CardHeader>

      {partnerGoal && (
        <InfoGrid>
          <InfoItem>
            <InfoLabel>Initiator</InfoLabel>
            <InfoValue>{formatAddress(partnerGoal.initiator)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Partner</InfoLabel>
            <InfoValue>{formatAddress(partnerGoal.partner)}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Your Stake</InfoLabel>
            <InfoValue>{formatEth(goal.stake)} ETH</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Deadline</InfoLabel>
            <InfoValue>{formatCountdown(goal.deadline)}</InfoValue>
          </InfoItem>
        </InfoGrid>
      )}

      {partnerGoal && (
        <ProgressBar
          progress={
            Number(goal.requiredCheckIns) > 0
              ? (Number(goal.checkInCount) / Number(goal.requiredCheckIns)) * 100
              : 0
          }
          status={status}
        />
      )}

      {isPending && isPartner && (
        <PendingBox>
          ⏳ You have been invited to this partner goal. Accept to join!
        </PendingBox>
      )}

      {isPending && !isPartner && (
        <PendingBox>
          ⏳ Waiting for partner to accept...
        </PendingBox>
      )}

      <ButtonGroup>
        {isPending && isPartner && (
          <AcceptButton
            onClick={() =>
              handleAcceptPartnerGoal(
                pgIndex,
                partnerGoal
                  ? formatEth(partnerGoal.initiatorStake)
                  : "0"
              )
            }
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "✓ Accept Goal"}
          </AcceptButton>
        )}

        {canResolve && (
          <ResolveButton
            onClick={() => handleResolvePartnerGoal(pgIndex)}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "🏆 Resolve Goal"}
          </ResolveButton>
        )}
      </ButtonGroup>
    </Card>
  );
};

export default PartnerInvite;