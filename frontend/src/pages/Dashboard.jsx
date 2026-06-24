import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import GoalCard from "../components/GoalCard";
import { formatEth } from "../utils/helpers";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
`;

const CreateButton = styled(Link)`
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #1a1a2e;
  border: 1px solid #2d2d5e;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
  }
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 900;
  color: ${(props) => props.$color || "#6366f1"};
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const GoalsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
`;

const EmptyState = styled.div`
  background: #1a1a2e;
  border: 1px dashed #2d2d5e;
  border-radius: 16px;
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  font-size: 1rem;
  margin-bottom: 20px;
`;

const NotConnected = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #94a3b8;
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px;
  color: #6366f1;
  font-size: 1.1rem;
`;

const Dashboard = ({
  account,
  activeGoals,
  completedGoals,
  failedGoals,
  isLoadingGoals,
  isLoading,
  handleCheckIn,
  handleCompleteGoal,
  handleFailGoal,
  getSuccessCount,
}) => {
  const [successCount, setSuccessCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      if (account && getSuccessCount) {
        const count = await getSuccessCount(account);
        setSuccessCount(Number(count));
      }
    };
    fetchStats();
  }, [account, completedGoals]);

  if (!account) {
    return (
      <NotConnected>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "8px" }}>
          Wallet Not Connected
        </h2>
        <p>Connect your wallet to view your dashboard.</p>
      </NotConnected>
    );
  }

  if (isLoadingGoals) {
    return <LoadingSpinner>Loading your goals...</LoadingSpinner>;
  }

  const totalGoals = activeGoals.length + completedGoals.length + failedGoals.length;
  const successRate = totalGoals > 0
    ? Math.round((completedGoals.length / totalGoals) * 100)
    : 0;

  return (
    <Container>
      <Header>
        <Title>My Dashboard</Title>
        <CreateButton to="/create">+ Create Goal</CreateButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <StatValue $color="#6366f1">{activeGoals.length}</StatValue>
          <StatLabel>Active Goals</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $color="#22c55e">{completedGoals.length}</StatValue>
          <StatLabel>Completed</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $color="#ef4444">{failedGoals.length}</StatValue>
          <StatLabel>Failed</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $color="#f59e0b">{successRate}%</StatValue>
          <StatLabel>Success Rate</StatLabel>
        </StatCard>
        <StatCard>
          <StatValue $color="#22c55e">{successCount}</StatValue>
          <StatLabel>Total Wins</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>🔥 Active Goals</SectionTitle>
        {activeGoals.length === 0 ? (
          <EmptyState>
            <EmptyIcon>🎯</EmptyIcon>
            <EmptyText>No active goals yet. Start your accountability journey!</EmptyText>
            <CreateButton to="/create">Create Your First Goal</CreateButton>
          </EmptyState>
        ) : (
          <GoalsGrid>
            {activeGoals.map((goal, index) => (
              <GoalCard
                key={index}
                goal={goal}
                isLoading={isLoading}
                handleCheckIn={handleCheckIn}
                handleCompleteGoal={handleCompleteGoal}
                handleFailGoal={handleFailGoal}
              />
            ))}
          </GoalsGrid>
        )}
      </Section>

      {completedGoals.length > 0 && (
        <Section>
          <SectionTitle>✅ Completed Goals</SectionTitle>
          <GoalsGrid>
            {completedGoals.map((goal, index) => (
              <GoalCard
                key={index}
                goal={goal}
                isLoading={isLoading}
                handleCheckIn={handleCheckIn}
                handleCompleteGoal={handleCompleteGoal}
                handleFailGoal={handleFailGoal}
              />
            ))}
          </GoalsGrid>
        </Section>
      )}

      {failedGoals.length > 0 && (
        <Section>
          <SectionTitle>❌ Failed Goals</SectionTitle>
          <GoalsGrid>
            {failedGoals.map((goal, index) => (
              <GoalCard
                key={index}
                goal={goal}
                isLoading={isLoading}
                handleCheckIn={handleCheckIn}
                handleCompleteGoal={handleCompleteGoal}
                handleFailGoal={handleFailGoal}
              />
            ))}
          </GoalsGrid>
        </Section>
      )}
    </Container>
  );
};

export default Dashboard;