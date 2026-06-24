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

const CheckInButton = ({
  goalId,
  isExpired,
  isLoading,
  checkInCount,
  requiredCheckIns,
  handleCheckIn,
  handleCompleteGoal,
  handleFailGoal,
}) => {
  const minRequired = Math.floor(requiredCheckIns * 0.8);
  const canComplete = isExpired && checkInCount >= minRequired;
  const canFail = isExpired && checkInCount < minRequired;

  return (
    <ButtonGroup>
      {!isExpired && (
        <CheckIn
          onClick={() => handleCheckIn(goalId)}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "✓ Check In"}
        </CheckIn>
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