import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../utils/contract";

const useContract = (signer) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const getContract = () => {
    if (!signer) return null;
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
  };

  const getReadContract = async () => {
    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`
    );
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
  };

  const createSoloGoal = async (description, durationInDays, frequency, stakeAmount) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.createSoloGoal(
        description,
        durationInDays,
        frequency,
        { value: ethers.parseEther(stakeAmount) }
      );
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Transaction failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const checkIn = async (goalId) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.checkIn(goalId);
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Check-in failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const completeGoal = async (goalId) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.completeGoal(goalId);
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to complete goal");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const failGoal = async (goalId) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.failGoal(goalId);
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to mark goal as failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createPartnerGoal = async (description, durationInDays, frequency, partnerAddress, stakeAmount) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.createPartnerGoal(
        description,
        durationInDays,
        frequency,
        partnerAddress,
        { value: ethers.parseEther(stakeAmount) }
      );
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to create partner goal");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptPartnerGoal = async (partnerGoalId, stakeAmount) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.acceptPartnerGoal(
        partnerGoalId,
        { value: ethers.parseEther(stakeAmount) }
      );
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to accept partner goal");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const resolvePartnerGoal = async (partnerGoalId) => {
    try {
      setIsLoading(true);
      setError(null);
      const contract = getContract();
      const tx = await contract.resolvePartnerGoal(partnerGoalId);
      setTxHash(tx.hash);
      await tx.wait();
      return true;
    } catch (err) {
      setError(err.message || "Failed to resolve partner goal");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getGoal = async (goalId) => {
    try {
      const contract = await getReadContract();
      const goal = await contract.getGoal(goalId);
      return goal;
    } catch (err) {
      setError(err.message || "Failed to fetch goal");
      return null;
    }
  };

  const getUserGoals = async (address) => {
    try {
      const contract = await getReadContract();
      const goalIds = await contract.getUserGoals(address);
      return goalIds;
    } catch (err) {
      setError(err.message || "Failed to fetch user goals");
      return [];
    }
  };

  const getPartnerGoal = async (partnerGoalId) => {
    try {
      const contract = await getReadContract();
      const pg = await contract.getPartnerGoal(partnerGoalId);
      return pg;
    } catch (err) {
      setError(err.message || "Failed to fetch partner goal");
      return null;
    }
  };

  const getPoolBalance = async () => {
    try {
      const contract = await getReadContract();
      const balance = await contract.getPoolBalance();
      return balance;
    } catch (err) {
      setError(err.message || "Failed to fetch pool balance");
      return 0;
    }
  };

  const getSuccessCount = async (address) => {
    try {
      const contract = await getReadContract();
      const count = await contract.getSuccessCount(address);
      return count;
    } catch (err) {
      setError(err.message || "Failed to fetch success count");
      return 0;
    }
  };

  const getGoalCounter = async () => {
    try {
      const contract = await getReadContract();
      const count = await contract.goalCounter();
      return count;
    } catch (err) {
      setError(err.message || "Failed to fetch goal counter");
      return 0;
    }
  };

  return {
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
  };
};

export default useContract;