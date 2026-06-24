import { Link } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  min-height: calc(100vh - 70px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  text-align: center;
`;

const HeroSection = styled.div`
  max-width: 800px;
  margin-bottom: 60px;
`;

const Badge = styled.div`
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  background: #1a1a2e;
  color: #6366f1;
  border: 1px solid #6366f1;
  margin-bottom: 24px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ffffff 0%, #6366f1 50%, #22c55e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #94a3b8;
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 40px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled(Link)`
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
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

const SecondaryButton = styled(Link)`
  padding: 14px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  background: transparent;
  color: white;
  border: 2px solid #2d2d5e;
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    border-color: #6366f1;
    transform: translateY(-2px);
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  max-width: 1000px;
  width: 100%;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background: #1a1a2e;
  border: 1px solid #2d2d5e;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: left;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(99, 102, 241, 0.15);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2.5rem;
  margin-bottom: 16px;
`;

const FeatureTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 8px;
`;

const FeatureDesc = styled.p`
  font-size: 0.9rem;
  color: #94a3b8;
  line-height: 1.6;
`;

const StatsRow = styled.div`
  display: flex;
  gap: 48px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 60px;
`;

const Stat = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  background: linear-gradient(135deg, #6366f1, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const StatLabel = styled.div`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-top: 4px;
`;

const ConnectPrompt = styled.div`
  background: #1a1a2e;
  border: 1px solid #6366f1;
  border-radius: 16px;
  padding: 32px 48px;
  margin-bottom: 60px;
`;

const ConnectTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  margin-bottom: 8px;
`;

const ConnectDesc = styled.p`
  color: #94a3b8;
  margin-bottom: 24px;
`;

const ConnectButton = styled.button`
  padding: 12px 32px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  }
`;

const features = [
  {
    icon: "🎯",
    title: "Set Meaningful Goals",
    desc: "Create personal goals with deadlines and check-in frequencies that work for your lifestyle.",
  },
  {
    icon: "💎",
    title: "Stake ETH",
    desc: "Put real skin in the game. Stake ETH to commit to your goals — succeed and get it back.",
  },
  {
    icon: "🔥",
    title: "Build Streaks",
    desc: "Check in regularly to build streaks and prove your consistency on-chain.",
  },
  {
    icon: "🤝",
    title: "Partner Mode",
    desc: "Challenge a friend. You both stake ETH and hold each other accountable.",
  },
  {
    icon: "🏆",
    title: "Earn Rewards",
    desc: "Winners share the community pool built from failed goals. Commitment pays off.",
  },
  {
    icon: "⛓️",
    title: "100% On-Chain",
    desc: "Your progress is immutable and transparent. No central authority, just code.",
  },
];

const Home = ({ account, connectWallet, isConnecting }) => {
  return (
    <Container>
      <HeroSection>
        <Badge>⚡ Built on Ethereum</Badge>
        <Title>
          Accountability
          <br />
          Has Consequences
        </Title>
        <Subtitle>
          SelfCheck is a decentralized accountability dApp where you stake ETH
          on your personal goals. Succeed and get your stake back. Fail and fund
          the winners.
        </Subtitle>
        <ButtonGroup>
          {account ? (
            <>
              <PrimaryButton to="/create">Create a Goal</PrimaryButton>
              <SecondaryButton to="/dashboard">My Dashboard</SecondaryButton>
            </>
          ) : (
            <ConnectButton onClick={connectWallet} disabled={isConnecting}>
              {isConnecting ? "Connecting..." : "Connect Wallet to Start"}
            </ConnectButton>
          )}
        </ButtonGroup>
      </HeroSection>

      <StatsRow>
        <Stat>
          <StatValue>100%</StatValue>
          <StatLabel>On-Chain</StatLabel>
        </Stat>
        <Stat>
          <StatValue>0%</StatValue>
          <StatLabel>Central Authority</StatLabel>
        </Stat>
        <Stat>
          <StatValue>2</StatValue>
          <StatLabel>Game Modes</StatLabel>
        </Stat>
        <Stat>
          <StatValue>ETH</StatValue>
          <StatLabel>Real Stakes</StatLabel>
        </Stat>
      </StatsRow>

      <FeaturesGrid>
        {features.map((feature) => (
          <FeatureCard key={feature.title}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureDesc>{feature.desc}</FeatureDesc>
          </FeatureCard>
        ))}
      </FeaturesGrid>

      {!account && (
        <ConnectPrompt>
          <ConnectTitle>Ready to be accountable?</ConnectTitle>
          <ConnectDesc>
            Connect your MetaMask wallet to start creating goals and staking ETH.
          </ConnectDesc>
          <ConnectButton onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </ConnectButton>
        </ConnectPrompt>
      )}
    </Container>
  );
};

export default Home;