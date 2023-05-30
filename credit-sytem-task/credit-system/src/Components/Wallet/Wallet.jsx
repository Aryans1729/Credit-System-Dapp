import React, { useState } from "react";
import { ethers } from "ethers";
import "./Wallet.css";
import ABI from "./ABI.json";

const CONTRACT_ADDRESS = "0x72de76c327FDAAb3C435459e6Bb4222ABbe354C4";

const Wallet = ({ saveState, saveBalance }) => {
  const [isMetamaskConnected, setIsMetamaskConnected] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [userAddress, setUserAddress] = useState(null);

  const initAccount = async () => {
    try {
      if (!isMetamaskConnected) {
        if (window.ethereum && window.ethereum.isMetaMask) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          const network = await provider.getNetwork();
          const chainId = network.chainId;

          if (chainId !== 97n) {
            alert("Please switch to Bsc Testnet");
            const networkRequest = {
              method: "wallet_switchEthereumChain",
              params: [{ chainId: "0x61" }], // Replace with the desired chain ID
            };

            await window.ethereum.request(networkRequest);
          }

          const signer = await provider.getSigner();

          const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
          let balance = await contract.balanceOf(accounts[0]);
          balance = balance.toString();

          const state = {
            signer: signer,
            contract: contract,
          };

          saveBalance(balance);
          saveState(state);
          setUserAddress(accounts[0]);
          setIsMetamaskConnected(true);
          setDisabled(true);
        } else {
          alert("You need to install Metamask first");
        }
      }
    } catch (error) {
      if (error.code === 4001) {
        alert("Please Connect again with bsc Testnet network in metamask");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div>
      <div className="Wallet-Container">
        <div className="wallet-details">
          {userAddress ? userAddress : "User Address"}
        </div>
        <button
          className="wallet-submit"
          onClick={initAccount}
          disabled={disabled}
        >
          {isMetamaskConnected ? "Connected" : "Connected Wallet"}
        </button>
      </div>
    </div>
  );
};

export default Wallet;
