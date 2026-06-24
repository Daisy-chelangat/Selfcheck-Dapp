import { useState } from "react";
import styled from "styled-components";
import GoalCard from "../components/GoalCard";
import PartnerInvite from "../components/PartnerInvite";

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 24px;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #94a3b8;
  margin-bottom: 40px;
`;

const TabRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 32px;
  border-bottom: 1px solid #2d2d5e;
  padding-bottom: 0;
`;

const Tab = styled.button`
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${(props) => (props.$active ? "#6366f1" : "#94a3b8")};
  border-bottom: 2px solid ${(props) => (props.$active ? "#6366f1" : "transparent")};
  transition: all 0.2s ease;
  margin-bottom: -1px;

  &:hover {
    color: #ffffff;
  }
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

const tabs = [
  { label: "🔥 Active", key: "active" },
  { label: "✅ Completed", key: "completed" },
  { label: "❌ Failed", key: "failed" },
  { label: "🤝 Partner", key: "partner" },
];

const MyGoals = ({
  account,
  goals,
  activeGoals,
  completedGoals,
  failedGoals,
  isLoadingGoals,
  isLoading,
  handleCheckIn,
  handleCompleteGoal,
  handleFailGoal,
  handleAcceptPartnerGoal,
  handleResolvePartnerGoal,
  getPartnerGoal,
}) => {
  const [activeTab, setActiveTab] = useState("active");

  if (!account) {
    return (
      <NotConnected>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "8px" }}>
          Wallet Not Connected
        </h2>
        <p>Connect your wallet to view your goals.</p>
      </NotConnected>
    );
  }

  if (isLoadingGoals) {
    return <LoadingSpinner>Loading your goals...</LoadingSpinner>;
  }

  const partnerGoals = goals.filter((g) => g.isPartnerGoal);

  const renderGoals = (goalList) => {
    if (goalList.length === 0) {
      return (
        <EmptyState>
          <EmptyIcon>🎯</EmptyIcon>
          <p>No goals in this category yet.</p>
        </EmptyState>
      );
    }

    return (
      <GoalsGrid>
        {goalList.map((goal, index) => (
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
    );
  };

  return (
    <Container>
      <Title>My Goals</Title>
      <Subtitle>Track and manage all your accountability goals.</Subtitle>

      <TabRow>
        {tabs.map((tab) => (
          <Tab
            key={tab.key}
            $active={activeTab === tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
            {tab.key === "active" && ` (${activeGoals.length})`}
            {tab.key === "completed" && ` (${completedGoals.length})`}
            {tab.key === "failed" && ` (${failedGoals.length})`}
            {tab.key === "partner" && ` (${partnerGoals.length})`}
          </Tab>
        ))}
      </TabRow>

      {activeTab === "active" && renderGoals(activeGoals)}
      {activeTab === "completed" && renderGoals(completedGoals)}
      {activeTab === "failed" && renderGoals(failedGoals)}
      {activeTab === "partner" && (
        <div>
          {partnerGoals.length === 0 ? (
            <EmptyState>
              <EmptyIcon>🤝</EmptyIcon>
              <p>No partner goals yet. Invite a friend to get started!</p>
            </EmptyState>
          ) : (
            <GoalsGrid>
              {partnerGoals.map((goal, index) => (
                <PartnerInvite
                  key={index}
                  goal={goal}
                  account={account}
                  isLoading={isLoading}
                  getPartnerGoal={getPartnerGoal}
                  handleAcceptPartnerGoal={handleAcceptPartnerGoal}
                  handleResolvePartnerGoal={handleResolvePartnerGoal}
                />
              ))}
            </GoalsGrid>
          )}
        </div>
      )}
    </Container>
  );
};

export default MyGoals;