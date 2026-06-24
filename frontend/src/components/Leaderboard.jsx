import { useState, useEffect } from "react";
import styled from "styled-components";
import { formatAddress } from "../utils/helpers";

const Card = styled.div`
  background: #1a1a2e;
  border: 1px solid #2d2d5e;
  border-radius: 16px;
  overflow: hidden;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const THead = styled.thead`
  background: #0f0f0f;
`;

const TH = styled.th`
  padding: 14px 20px;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const TR = styled.tr`
  border-bottom: 1px solid #2d2d5e;
  transition: all 0.2s ease;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #1e1e3f;
  }

  background: ${(props) => (props.$isUser ? "#1e1b4b" : "transparent")};
`;

const TD = styled.td`
  padding: 16px 20px;
  font-size: 0.9rem;
  color: #ffffff;
`;

const Rank = styled.div`
  font-size: 1.2rem;
  font-weight: 900;
  color: ${(props) => {
    if (props.$rank === 1) return "#f59e0b";
    if (props.$rank === 2) return "#94a3b8";
    if (props.$rank === 3) return "#cd7f32";
    return "#6366f1";
  }};
`;

const AddressCell = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const YouBadge = styled.div`
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  background: #1e1b4b;
  color: #6366f1;
  border: 1px solid #6366f1;
`;

const ScoreCell = styled.div`
  font-weight: 700;
  color: #22c55e;
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #94a3b8;
`;

const LoadingState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #6366f1;
`;

const mockLeaderboard = [
  { address: "0x1234567890123456789012345678901234567890", wins: 12 },
  { address: "0x2345678901234567890123456789012345678901", wins: 9 },
  { address: "0x3456789012345678901234567890123456789012", wins: 7 },
  { address: "0x4567890123456789012345678901234567890123", wins: 5 },
  { address: "0x5678901234567890123456789012345678901234", wins: 3 },
];

const Leaderboard = ({ account, getSuccessCount }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const buildLeaderboard = async () => {
      try {
        setIsLoading(true);

        let entries = [...mockLeaderboard];

        if (account && getSuccessCount) {
          const userWins = await getSuccessCount(account);
          const exists = entries.find(
            (e) => e.address.toLowerCase() === account.toLowerCase()
          );

          if (!exists) {
            entries.push({ address: account, wins: Number(userWins) });
          } else {
            entries = entries.map((e) =>
              e.address.toLowerCase() === account.toLowerCase()
                ? { ...e, wins: Number(userWins) }
                : e
            );
          }
        }

        entries.sort((a, b) => b.wins - a.wins);
        setLeaderboard(entries);
      } catch (err) {
        console.error("Failed to build leaderboard:", err);
        setLeaderboard(mockLeaderboard);
      } finally {
        setIsLoading(false);
      }
    };

    buildLeaderboard();
  }, [account]);

  if (isLoading) {
    return <LoadingState>Loading leaderboard...</LoadingState>;
  }

  if (leaderboard.length === 0) {
    return (
      <EmptyState>
        <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🏆</div>
        <p>No entries yet. Complete goals to appear on the leaderboard!</p>
      </EmptyState>
    );
  }

  return (
    <Card>
      <Table>
        <THead>
          <tr>
            <TH>Rank</TH>
            <TH>Address</TH>
            <TH>Goals Won</TH>
          </tr>
        </THead>
        <tbody>
          {leaderboard.map((entry, index) => {
            const isUser =
              account &&
              entry.address.toLowerCase() === account.toLowerCase();
            return (
              <TR key={entry.address} $isUser={isUser}>
                <TD>
                  <Rank $rank={index + 1}>
                    {index === 0
                      ? "🥇"
                      : index === 1
                      ? "🥈"
                      : index === 2
                      ? "🥉"
                      : `#${index + 1}`}
                  </Rank>
                </TD>
                <TD>
                  <AddressCell>
                    {formatAddress(entry.address)}
                    {isUser && <YouBadge>You</YouBadge>}
                  </AddressCell>
                </TD>
                <TD>
                  <ScoreCell>{entry.wins} wins</ScoreCell>
                </TD>
              </TR>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
};

export default Leaderboard;