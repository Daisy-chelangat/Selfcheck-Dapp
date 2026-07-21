import { ethers } from "ethers";

export const formatEth = (wei) => {
  return parseFloat(ethers.formatEther(wei)).toFixed(4);
};

export const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatDate = (timestamp) => {
  if (!timestamp || timestamp === 0) return "N/A";
  return new Date(Number(timestamp) * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatCountdown = (deadline) => {
  const now = Math.floor(Date.now() / 1000);
  const diff = Number(deadline) - now;

  if (diff <= 0) return "Expired";

  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  const minutes = Math.floor((diff % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m left`;
};

export const getGoalStatus = (status) => {
  const statuses = ["Active", "Completed", "Failed"];
  return statuses[status] || "Unknown";
};

export const getFrequencyLabel = (frequency) => {
  const frequencies = ["Daily", "Every 2 Days", "Weekly"];
  return frequencies[frequency] || "Unknown";
};

export const calculateProgress = (checkInCount, requiredCheckIns) => {
  if (!requiredCheckIns || requiredCheckIns === 0) return 0;
  return Math.min((Number(checkInCount) / Number(requiredCheckIns)) * 100, 100);
};
export const getCategoryLabel = (category) => {
  const categories = [
    "Learning",
    "Fitness", 
    "Health",
    "Reading",
    "Finance",
    "Prayer",
    "Personal Development",
    "Other",
  ];
  return categories[category] || "Other";
};

export const calculateStreak = (checkInHistory, frequencySeconds) => {
  if (!checkInHistory || checkInHistory.length === 0) return 0;

  const sorted = [...checkInHistory]
    .map(Number)
    .sort((a, b) => b - a);

  let streak = 1;
  for (let i = 0; i < sorted.length - 1; i++) {
    const diff = sorted[i] - sorted[i + 1];
    const tolerance = frequencySeconds * 1.5;
    if (diff <= tolerance) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

export const getFrequencySeconds = (frequency) => {
  if (frequency === 0) return 86400;
  if (frequency === 1) return 172800;
  return 604800;
};

export const SEPOLIA_CHAIN_ID = "0xaa36a7";