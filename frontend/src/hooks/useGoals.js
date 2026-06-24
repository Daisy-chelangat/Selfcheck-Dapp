import { useState, useEffect, useCallback } from "react";
import useContract from "./useContract";
import { getGoalStatus } from "../utils/helpers";

const useGoals = (signer, account) => {
  const [goals, setGoals] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);
  const [activeGoals, setActiveGoals] = useState([]);
  const [completedGoals, setCompletedGoals] = useState([]);
  const [failedGoals, setFailedGoals] = useState([]);

  const {
    isLoading,
    error,
    txHash,
    createSoloGoal,
    checkIn,
    completeGoal,
    failGoal,
    createPartnerGoal,
    acceptPartnerGoal,
    resolvePartnerGoal,
    getGoal,
    getUserGoals,
    getPartnerGoal,
    getPoolBalance,
    getSuccessCount,
    getGoalCounter,
  } = useContract(signer);

  const fetchUserGoals = useCallback(async () => {
    if (!account) return;

    try {
      setIsLoadingGoals(true);
      const goalIds = await getUserGoals(account);

      const goalPromises = goalIds.map((id) => getGoal(id));
      const fetchedGoals = await Promise.all(goalPromises);

      const validGoals = fetchedGoals.filter(Boolean);
      setGoals(validGoals);

      setActiveGoals(
        validGoals.filter((g) => getGoalStatus(g.status) === "Active")
      );
      setCompletedGoals(
        validGoals.filter((g) => getGoalStatus(g.status) === "Completed")
      );
      setFailedGoals(
        validGoals.filter((g) => getGoalStatus(g.status) === "Failed")
      );
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    } finally {
      setIsLoadingGoals(false);
    }
  }, [account]);

  const handleCreateSoloGoal = async (
    description,
    durationInDays,
    frequency,
    stakeAmount
  ) => {
    const success = await createSoloGoal(
      description,
      durationInDays,
      frequency,
      stakeAmount
    );
    if (success) await fetchUserGoals();
    return success;
  };

  const handleCheckIn = async (goalId) => {
    const success = await checkIn(goalId);
    if (success) await fetchUserGoals();
    return success;
  };

  const handleCompleteGoal = async (goalId) => {
    const success = await completeGoal(goalId);
    if (success) await fetchUserGoals();
    return success;
  };

  const handleFailGoal = async (goalId) => {
    const success = await failGoal(goalId);
    if (success) await fetchUserGoals();
    return success;
  };

  const handleCreatePartnerGoal = async (
    description,
    durationInDays,
    frequency,
    partnerAddress,
    stakeAmount
  ) => {
    const success = await createPartnerGoal(
      description,
      durationInDays,
      frequency,
      partnerAddress,
      stakeAmount
    );
    if (success) await fetchUserGoals();
    return success;
  };

  const handleAcceptPartnerGoal = async (partnerGoalId, stakeAmount) => {
    const success = await acceptPartnerGoal(partnerGoalId, stakeAmount);
    if (success) await fetchUserGoals();
    return success;
  };

  const handleResolvePartnerGoal = async (partnerGoalId) => {
    const success = await resolvePartnerGoal(partnerGoalId);
    if (success) await fetchUserGoals();
    return success;
  };

  useEffect(() => {
    if (account) fetchUserGoals();
  }, [account, fetchUserGoals]);

  return {
    goals,
    activeGoals,
    completedGoals,
    failedGoals,
    isLoadingGoals,
    isLoading,
    error,
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
  };
};

export default useGoals;