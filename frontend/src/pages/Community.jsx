import { useState, useEffect } from "react";
import styled from "styled-components";
import Leaderboard from "../components/Leaderboard";
import { formatEth } from "../utils/helpers";

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

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const StatCard = styled.div`
  background: #1a1a2e;
  border: 1px solid #2d2d5e;
  border-radius: 16px;
  padding: 28px 24px;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    transform: translateY(-2px);
  }
`;

const StatIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 12px;
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
`;

const PoolCard = styled.div`
  background: linear-gradient(135deg, #1a1a2e, #1e1b4b);
  border: 1px solid #6366f1;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
  margin-bottom: 40px;
`;

const PoolLeft = styled.div``;

const PoolTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  color: #94a3b8;
  margin-bottom: 8px;
`;

const PoolAmount = styled.div`
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const PoolDesc = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 8px;
  max-width: 400px;
  line-height: 1.6;
`;

const PoolRight = styled.div`
  text-align: center;
`;

const PoolIcon = styled.div`
  font-size: 5rem;
`;

const HowItWorksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
`;

const StepCard = styled.div`
  background: #1a1a2e;
  border: 1px solid #2d2d5e;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
  }
`;

const StepNumber = styled.div`
  font-size: 0.75rem;
  font-weight: 700;
  color: #6366f1;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
`;

const StepTitle = styled.h3`
  font-size: 1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const StepDesc = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.6;
`;

const steps = [
  {
    step: "Step 01",
    title: "Stake ETH on your goal",
    desc: "Create a goal and lock ETH as your commitment. The more you stake, the more motivation you have.",
  },
  {
    step: "Step 02",
    title: "Check in regularly",
    desc: "Check in daily, every 2 days, or weekly. Each check-in is recorded permanently on-chain.",
  },
  {
    step: "Step 03",
    title: "Complete or fail",
    desc: "Hit 80% of required check-ins by deadline → success. Miss too many → your stake goes to the pool.",
  },
  {
    step: "Step 04",
    title: "Winners share the pool",
    desc: "Successful users share the community pool built from failed goals. Accountability literally pays.",
  },
];

const Community = ({
  account,
  getPoolBalance,
  getSuccessCount,
  getGoalCounter,
}) => {
  const [poolBalance, setPoolBalance] = useState("0");
  const [totalGoals, setTotalGoals] = useState(0);
  const [userSuccessCount, setUserSuccessCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);

        const pool = await getPoolBalance();
        setPoolBalance(formatEth(pool));

        const counter = await getGoalCounter();
        setTotalGoals(Number(counter));

        if (account) {
          const successes = await getSuccessCount(account);
          setUserSuccessCount(Number(successes));
        }
      } catch (err) {
        console.error("Failed to fetch community stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [account]);

  return (
    <Container>
      <Title>Community</Title>
      <Subtitle>
        The accountability ecosystem — powered by commitment, rewarded by consistency.
      </Subtitle>

      <PoolCard>
        <PoolLeft>
          <PoolTitle>Community Pool</PoolTitle>
          <PoolAmount>
            {isLoading ? "Loading..." : `${poolBalance} ETH`}
          </PoolAmount>
          <PoolDesc>
            This pool is funded by failed goals. Successful users share it as a
            bonus reward on top of their returned stake.
          </PoolDesc>
        </PoolLeft>
        <PoolRight>
          <PoolIcon>🏆</PoolIcon>
        </PoolRight>
      </PoolCard>

      <StatsGrid>
        <StatCard>
          <StatIcon>🎯</StatIcon>
          <StatValue $color="#6366f1">
            {isLoading ? "..." : totalGoals}
          </StatValue>
          <StatLabel>Total Goals Created</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>✅</StatIcon>
          <StatValue $color="#22c55e">
            {isLoading ? "..." : userSuccessCount}
          </StatValue>
          <StatLabel>Your Completed Goals</StatLabel>
        </StatCard>
        <StatCard>
          <StatIcon>💎</StatIcon>
          <StatValue $color="#f59e0b">
            {isLoading ? "..." : `${poolBalance}`}
          </StatValue>
          <StatLabel>Pool Balance (ETH)</StatLabel>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionTitle>🏅 Leaderboard</SectionTitle>
        <Leaderboard
          account={account}
          getSuccessCount={getSuccessCount}
        />
      </Section>

      <Section>
        <SectionTitle>⚙️ How It Works</SectionTitle>
        <HowItWorksGrid>
          {steps.map((step) => (
            <StepCard key={step.step}>
              <StepNumber>{step.step}</StepNumber>
              <StepTitle>{step.title}</StepTitle>
              <StepDesc>{step.desc}</StepDesc>
            </StepCard>
          ))}
        </HowItWorksGrid>
      </Section>
    </Container>
  );
};

export default Community;