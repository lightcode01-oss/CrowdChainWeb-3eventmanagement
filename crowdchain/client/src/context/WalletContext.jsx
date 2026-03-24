import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';

const WalletContext = createContext();

export const useWallet = () => useContext(WalletContext);

export const WalletProvider = ({ children }) => {
  const [address, setAddress] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('jwtToken'));

  useEffect(() => {
    // Check if wallet is already connected
    checkIfWalletIsConnected();
  }, []);

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) return;

      const accounts = await window.ethereum.request({ method: 'eth_accounts' });

      if (accounts.length) {
        setAddress(accounts[0]);
        const _provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(_provider);
        const _signer = await _provider.getSigner();
        setSigner(_signer);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) return alert('Please install MetaMask!');
    
    setIsConnecting(true);
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const currentAddress = accounts[0];
      
      const sepoliaChainId = '0xaa36a7';
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: sepoliaChainId,
              chainName: 'Sepolia test network',
              nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
              rpcUrls: ['https://rpc.sepolia.org'],
              blockExplorerUrls: ['https://sepolia.etherscan.io'],
            }],
          });
        } else {
          throw switchError;
        }
      }

      setAddress(currentAddress);
      
      const _provider = new ethers.BrowserProvider(window.ethereum);
      setProvider(_provider);
      const _signer = await _provider.getSigner();
      setSigner(_signer);

      // Authenticate with backend
      const message = "Sign this message to login to CrowdChain";
      const signature = await _signer.signMessage(message);

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';
      const response = await axios.post(`${API_URL}/api/auth/wallet-login`, {
        address: currentAddress,
        signature,
        message
      });

      if (response.data.token) {
        setToken(response.data.token);
        localStorage.setItem('jwtToken', response.data.token);
      }
    } catch (error) {
      console.error('Wallet connection/login failed:', error);
      alert('Login to server failed! Error: ' + (error.response?.data?.error || error.message));
      disconnectWallet();
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAddress(null);
    setProvider(null);
    setSigner(null);
    setToken(null);
    localStorage.removeItem('jwtToken');
  };

  return (
    <WalletContext.Provider value={{ address, provider, signer, token, connectWallet, disconnectWallet, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
};
