import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { GlobalStyles, theme } from "./styles/GlobalStyles";
import useWallet from "./hooks/useWallet";
import useGoals from "./hooks/useGoals";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import CreateGoal from "./pages/CreateGoal";
import MyGoals from "./pages/MyGoals";
import Community from "./pages/Community";

function App() {
  const {
    account,
    signer,
    isConnecting,
    error: walletError,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  } = useWallet();

  const {
    goals,
    activeGoals,
    completedGoals,
    failedGoals,
    isLoadingGoals,
    isLoading,
    error: goalsError,
    txHash,
    fetchUserGoals,
    handleCreateSoloGoal,
    handleCheckIn,
    handleCompleteGoal,
    handleFailGoal,
    handleCreatePartnerGoal,
    handleAcceptPartnerGoal,
    handleResolvePartnerGoal,
    getPartnerGoal,
    getPoolBalance,
    getSuccessCount,
    getGoalCounter,
  } = useGoals(signer, account);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Router>
        <Navbar
          account={account}
          isConnecting={isConnecting}
          isCorrectNetwork={isCorrectNetwork}
          connectWallet={connectWallet}
          disconnectWallet={disconnectWallet}
          switchToSepolia={switchToSepolia}
        />

        {walletError && (
          <div className="fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg z-50">
            {walletError}
          </div>
        )}

        {txHash && (
          <div className="fixed top-20 right-4 bg-indigo-500 text-white px-4 py-2 rounded-lg z-50">
            <p className="text-sm">Transaction sent!</p>
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline"
            >
              View on Etherscan
            </a>
          </div>
        )}

        <Routes>
          <Route
            path="/"
            element={
              <Home
                account={account}
                connectWallet={connectWallet}
                isConnecting={isConnecting}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <Dashboard
                account={account}
                activeGoals={activeGoals}
                completedGoals={completedGoals}
                failedGoals={failedGoals}
                isLoadingGoals={isLoadingGoals}
                isLoading={isLoading}
                handleCheckIn={handleCheckIn}
                handleCompleteGoal={handleCompleteGoal}
                handleFailGoal={handleFailGoal}
                getSuccessCount={getSuccessCount}
              />
            }
          />
          <Route
            path="/create"
            element={
              <CreateGoal
                account={account}
                isLoading={isLoading}
                handleCreateSoloGoal={handleCreateSoloGoal}
                handleCreatePartnerGoal={handleCreatePartnerGoal}
              />
            }
          />
          <Route
            path="/my-goals"
            element={
              <MyGoals
                account={account}
                goals={goals}
                activeGoals={activeGoals}
                completedGoals={completedGoals}
                failedGoals={failedGoals}
                isLoadingGoals={isLoadingGoals}
                isLoading={isLoading}
                handleCheckIn={handleCheckIn}
                handleCompleteGoal={handleCompleteGoal}
                handleFailGoal={handleFailGoal}
                handleAcceptPartnerGoal={handleAcceptPartnerGoal}
                handleResolvePartnerGoal={handleResolvePartnerGoal}
                getPartnerGoal={getPartnerGoal}
              />
            }
          />
          <Route
            path="/community"
            element={
              <Community
                account={account}
                getPoolBalance={getPoolBalance}
                getSuccessCount={getSuccessCount}
                getGoalCounter={getGoalCounter}
              />
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;