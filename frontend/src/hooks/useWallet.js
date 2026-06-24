import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { SEPOLIA_CHAIN_ID } from "../utils/helpers";

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(false);

  const checkNetwork = async () => {
    if (!window.ethereum) return;
    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    });
    setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
    } catch (error) {
      setError("Failed to switch network");
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      setError("MetaMask not found. Please install it.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const web3Signer = await web3Provider.getSigner();

      setAccount(accounts[0]);
      setProvider(web3Provider);
      setSigner(web3Signer);

      await checkNetwork();
    } catch (error) {
      setError("Failed to connect wallet");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setIsCorrectNetwork(false);
  };

  useEffect(() => {
    if (!window.ethereum) return;

    window.ethereum.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        disconnectWallet();
      } else {
        setAccount(accounts[0]);
      }
    });

    window.ethereum.on("chainChanged", () => {
      checkNetwork();
    });

    return () => {
      window.ethereum.removeAllListeners("accountsChanged");
      window.ethereum.removeAllListeners("chainChanged");
    };
  }, []);

  return {
    account,
    provider,
    signer,
    isConnecting,
    error,
    isCorrectNetwork,
    connectWallet,
    disconnectWallet,
    switchToSepolia,
  };
};

export default useWallet;