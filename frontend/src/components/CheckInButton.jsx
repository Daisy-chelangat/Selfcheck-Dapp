import { useState, useEffect } from "react";
import styled from "styled-components";

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
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
    transform: none;
  }
`;

const CheckIn = styled(Button)`
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }
`;

const Complete = styled(Button)`
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(34, 197, 94, 0.4);
  }
`;

const Fail = styled(Button)`
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;

  &:hover:not(:disabled) {
    background: #7f1d1d;
    transform: translateY(-1px);
  }
`;

const WaitingBox = styled.div`
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #0f0f0f;
  border: 1px solid #2d2d5e;
  color: #94a3b8;
  text-align: center;
`;

const PendingBox = styled.div`
  width: 100%;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #1e1b4b;
  border: 1px solid #6366f1;
  color: #6366f1;
  text-align: center;
`;

const getFrequencySeconds = (frequency) => {
  if (frequency === 0) return 86400;      // 1 day
  if (frequency === 1) return 172800;     // 2 days
  return 604800;                          // 7 days
};

const formatTimeLeft = (seconds) => {
  if (seconds <= 0) return "now";
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const CheckInButton = ({
  goalId,
  isExpired,
  isLoading,
  checkInCount,
  requiredCheckIns,
  lastCheckIn,
  frequency,
  isPartnerGoal,
  hasPendingRequest,
  handleCheckIn,
  handleCompleteGoal,
  handleFailGoal,
}) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Math.floor(Date.now() / 1000);
      const frequencySeconds = getFrequencySeconds(frequency);

      if (!lastCheckIn || lastCheckIn === 0) {
        setCanCheckIn(true);
        setTimeLeft(0);
        return;
      }

      const nextCheckIn = Number(lastCheckIn) + frequencySeconds;
      const diff = nextCheckIn - now;

      if (diff <= 0) {
        setCanCheckIn(true);
        setTimeLeft(0);
      } else {
        setCanCheckIn(false);
        setTimeLeft(diff);
      }
    };

    calculateTimeLeft();

    // update every minute
    const interval = setInterval(calculateTimeLeft, 60000);
    return () => clearInterval(interval);
  }, [lastCheckIn, frequency]);

  const minRequired = Math.floor(requiredCheckIns * 0.8);
  const canComplete = isExpired && checkInCount >= minRequired;
  const canFail = isExpired && checkInCount < minRequired;

  return (
    <ButtonGroup>
      {!isExpired && (
        <>
          {isPartnerGoal && hasPendingRequest ? (
            <PendingBox>
              ⏳ Awaiting partner approval...
            </PendingBox>
          ) : canCheckIn ? (
            <CheckIn
              onClick={() => handleCheckIn(goalId)}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "✓ Check In"}
            </CheckIn>
          ) : (
            <WaitingBox>
              ⏳ Next check-in in {formatTimeLeft(timeLeft)}
            </WaitingBox>
          )}
        </>
      )}

      {canComplete && (
        <Complete
          onClick={() => handleCompleteGoal(goalId)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "🏆 Complete Goal"}
        </Complete>
      )}

      {canFail && (
        <Fail
          onClick={() => handleFailGoal(goalId)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Mark as Failed"}
        </Fail>
      )}
    </ButtonGroup>
  );
};

export default CheckInButton;