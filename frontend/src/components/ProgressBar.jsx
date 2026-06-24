import styled from "styled-components";

const Container = styled.div`
  margin-bottom: 16px;
`;

const BarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const BarLabel = styled.div`
  font-size: 0.75rem;
  color: #94a3b8;
`;

const BarPercent = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: ${(props) => {
    if (props.$status === "Completed") return "#22c55e";
    if (props.$status === "Failed") return "#ef4444";
    if (props.$progress >= 80) return "#22c55e";
    if (props.$progress >= 40) return "#f59e0b";
    return "#6366f1";
  }};
`;

const Track = styled.div`
  width: 100%;
  height: 8px;
  background: #2d2d5e;
  border-radius: 100px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  border-radius: 100px;
  width: ${(props) => props.$progress}%;
  background: ${(props) => {
    if (props.$status === "Completed") return "#22c55e";
    if (props.$status === "Failed") return "#ef4444";
    if (props.$progress >= 80) return "#22c55e";
    if (props.$progress >= 40) return "#f59e0b";
    return "#6366f1";
  }};
  transition: width 0.5s ease;
`;

const ProgressBar = ({ progress, status }) => {
  const rounded = Math.round(progress);

  return (
    <Container>
      <BarHeader>
        <BarLabel>Progress</BarLabel>
        <BarPercent $progress={rounded} $status={status}>
          {rounded}%
        </BarPercent>
      </BarHeader>
      <Track>
        <Fill $progress={rounded} $status={status} />
      </Track>
    </Container>
  );
};

export default ProgressBar;