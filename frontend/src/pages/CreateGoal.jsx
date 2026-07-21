import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  max-width: 700px;
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

const Card = styled.div`
  background: #1a1a2e;
  border: 1px solid #2d2d5e;
  border-radius: 16px;
  padding: 32px;
`;

const ModeToggle = styled.div`
  display: flex;
  background: #0f0f0f;
  border-radius: 12px;
  padding: 4px;
  margin-bottom: 32px;
`;

const ModeButton = styled.button`
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.$active ? "#6366f1" : "transparent")};
  color: ${(props) => (props.$active ? "#ffffff" : "#94a3b8")};
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #94a3b8;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #2d2d5e;
  background: #0f0f0f;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #4a4a6a;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #2d2d5e;
  background: #0f0f0f;
  color: #ffffff;
  font-size: 0.95rem;
  outline: none;
  resize: vertical;
  min-height: 100px;
  font-family: inherit;
  transition: all 0.2s ease;

  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  &::placeholder {
    color: #4a4a6a;
  }
`;

const FrequencyGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const FrequencyOption = styled.button`
  padding: 12px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid ${(props) => (props.$active ? "#6366f1" : "#2d2d5e")};
  background: ${(props) => (props.$active ? "#1e1b4b" : "transparent")};
  color: ${(props) => (props.$active ? "#6366f1" : "#94a3b8")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #6366f1;
    color: #6366f1;
  }
`;

const StakeInfo = styled.div`
  background: #0f0f0f;
  border: 1px solid #2d2d5e;
  border-radius: 10px;
  padding: 16px;
  margin-top: 8px;
  font-size: 0.85rem;
  color: #94a3b8;
  line-height: 1.6;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  transition: all 0.2s ease;
  margin-top: 8px;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMsg = styled.div`
  background: #7f1d1d;
  color: #ef4444;
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  margin-bottom: 16px;
`;

const NotConnected = styled.div`
  text-align: center;
  padding: 80px 24px;
  color: #94a3b8;
`;

const frequencies = [
  { label: "Daily", value: 0 },
  { label: "Every 2 Days", value: 1 },
  { label: "Weekly", value: 2 },
];
const categories = [
  { label: "📚 Learning", value: 0 },
  { label: "💪 Fitness", value: 1 },
  { label: "🏥 Health", value: 2 },
  { label: "📖 Reading", value: 3 },
  { label: "💰 Finance", value: 4 },
  { label: "🙏 Prayer", value: 5 },
  { label: "🌱 Personal Development", value: 6 },
  { label: "✨ Other", value: 7 },
];

const CreateGoal = ({
  account,
  isLoading,
  handleCreateSoloGoal,
  handleCreatePartnerGoal,
}) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState("solo");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [stake, setStake] = useState("");
  const [partnerAddress, setPartnerAddress] = useState("");
  const [error, setError] = useState("");
  const [category, setCategory] = useState(0);
  const [customCategory, setCustomCategory] = useState("");

  if (!account) {
    return (
      <NotConnected>
        <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🔒</div>
        <h2 style={{ fontSize: "1.5rem", color: "#ffffff", marginBottom: "8px" }}>
          Wallet Not Connected
        </h2>
        <p>Connect your wallet to create goals.</p>
      </NotConnected>
    );
  }

  const handleSubmit = async () => {
    setError("");

    if (!description.trim()) {
      setError("Please enter a goal description.");
      return;
    }
    if (!duration || Number(duration) <= 0) {
      setError("Please enter a valid duration.");
      return;
    }
    if (!stake || Number(stake) <= 0) {
      setError("Please enter a valid stake amount.");
      return;
    }
    if (mode === "partner" && !partnerAddress.trim()) {
      setError("Please enter your partner's wallet address.");
      return;
    }
    const finalDescription = category === 7 && customCategory
  ? `${description} [${customCategory}]`
  : description;

    let success;

    if (mode === "solo") {
      success = await handleCreateSoloGoal(
        finaldescription,
        Number(duration),
        frequency,
        category,
        stake
      );
    } else {
      success = await handleCreatePartnerGoal(
        finaldescription,
        Number(duration),
        frequency,
        category,
        partnerAddress,
        stake
      );
    }

    if (success) navigate("/my-goals");
  };

  return (
    <Container>
      <Title>Create a Goal</Title>
      <Subtitle>
        Set your goal, stake ETH, and commit to your accountability journey.
      </Subtitle>

      <Card>
        <ModeToggle>
          <ModeButton
            $active={mode === "solo"}
            onClick={() => setMode("solo")}
          >
            🎯 Solo Mode
          </ModeButton>
          <ModeButton
            $active={mode === "partner"}
            onClick={() => setMode("partner")}
          >
            🤝 Partner Mode
          </ModeButton>
        </ModeToggle>

        {error && <ErrorMsg>{error}</ErrorMsg>}

        <FormGroup>
          <Label>Goal Description</Label>
          <TextArea
            placeholder="e.g. Exercise for 30 minutes every day..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Duration (in days)</Label>
          <Input
            type="number"
            placeholder="e.g. 30"
            min="1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </FormGroup>

        <FormGroup>
          <Label>Check-in Frequency</Label>
          <FrequencyGrid>
            {frequencies.map((f) => (
              <FrequencyOption
                key={f.value}
                $active={frequency === f.value}
                onClick={() => setFrequency(f.value)}
              >
                {f.label}
              </FrequencyOption>
            ))}
          </FrequencyGrid>
        </FormGroup>
        <FormGroup>
  <Label>Goal Category</Label>
  <div style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "10px",
  }}>
    {categories.map((c) => (
      <button
        key={c.value}
        onClick={() => setCategory(c.value)}
        style={{
          padding: "10px 8px",
          borderRadius: "10px",
          fontSize: "0.8rem",
          fontWeight: "600",
          border: `1px solid ${category === c.value ? "#6366f1" : "#2d2d5e"}`,
          background: category === c.value ? "#1e1b4b" : "transparent",
          color: category === c.value ? "#6366f1" : "#94a3b8",
          cursor: "pointer",
          transition: "all 0.2s ease",
          textAlign: "center",
        }}
      >
        {c.label}
      </button>
    ))}
  </div>

  {category === 7 && (
    <Input
      type="text"
      placeholder="Describe your category e.g. Music, Art, Coding..."
      value={customCategory}
      onChange={(e) => setCustomCategory(e.target.value)}
      style={{ marginTop: "12px" }}
    />
  )}
</FormGroup>

        <FormGroup>
          <Label>Stake Amount (ETH)</Label>
          <Input
            type="number"
            placeholder="e.g. 0.01"
            min="0"
            step="0.001"
            value={stake}
            onChange={(e) => setStake(e.target.value)}
          />
          <StakeInfo>
            💡 Your stake is locked until the goal deadline. Succeed → get it
            back. Fail → 95% goes to the community pool, 5% to treasury.
          </StakeInfo>
        </FormGroup>

        {mode === "partner" && (
          <FormGroup>
            <Label>Partner Wallet Address</Label>
            <Input
              type="text"
              placeholder="0x..."
              value={partnerAddress}
              onChange={(e) => setPartnerAddress(e.target.value)}
            />
          </FormGroup>
        )}

        <SubmitButton onClick={handleSubmit} disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : mode === "solo"
            ? "🎯 Create Solo Goal"
            : "🤝 Create Partner Goal"}
        </SubmitButton>
      </Card>
    </Container>
  );
};

export default CreateGoal;