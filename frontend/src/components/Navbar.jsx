import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { formatAddress } from "../utils/helpers";

const Nav = styled.nav`
  background: #1a1a2e;
  border-bottom: 1px solid #2d2d5e;
  padding: 0 24px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #22c55e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavLink = styled(Link)`
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${(props) => (props.$active ? "#ffffff" : "#94a3b8")};
  background: ${(props) => (props.$active ? "#6366f1" : "transparent")};
  transition: all 0.2s ease;

  &:hover {
    color: #ffffff;
    background: ${(props) => (props.$active ? "#6366f1" : "#2d2d5e")};
  }
`;

const WalletSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const NetworkBadge = styled.div`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${(props) => (props.$correct ? "#14532d" : "#7f1d1d")};
  color: ${(props) => (props.$correct ? "#22c55e" : "#ef4444")};
  border: 1px solid ${(props) => (props.$correct ? "#22c55e" : "#ef4444")};
  cursor: ${(props) => (props.$correct ? "default" : "pointer")};
`;

const ConnectButton = styled.button`
  padding: 8px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const AccountBadge = styled.div`
  padding: 8px 16px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  background: #2d2d5e;
  color: #ffffff;
  border: 1px solid #6366f1;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #3d3d7e;
  }
`;

const Navbar = ({
  account,
  isConnecting,
  isCorrectNetwork,
  connectWallet,
  disconnectWallet,
  switchToSepolia,
}) => {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Home" },
    { path: "/dashboard", label: "Dashboard" },
    { path: "/create", label: "Create Goal" },
    { path: "/my-goals", label: "My Goals" },
    { path: "/community", label: "Community" },
  ];

  return (
    <Nav>
      <Logo to="/">SelfCheck</Logo>

      <NavLinks>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            $active={location.pathname === item.path}
          >
            {item.label}
          </NavLink>
        ))}
      </NavLinks>

      <WalletSection>
        {account && (
          <NetworkBadge
            $correct={isCorrectNetwork}
            onClick={!isCorrectNetwork ? switchToSepolia : undefined}
          >
            {isCorrectNetwork ? "✓ Sepolia" : "⚠ Wrong Network"}
          </NetworkBadge>
        )}

        {account ? (
          <AccountBadge onClick={disconnectWallet}>
            {formatAddress(account)}
          </AccountBadge>
        ) : (
          <ConnectButton onClick={connectWallet} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Connect Wallet"}
          </ConnectButton>
        )}
      </WalletSection>
    </Nav>
  );
};

export default Navbar;