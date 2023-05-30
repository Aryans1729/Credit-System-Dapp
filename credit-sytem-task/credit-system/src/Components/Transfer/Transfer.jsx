import "./Transfer.css";
import React, { useState } from "react";

const Transfer = ({ state, saveBalance }) => {
  const { contract } = state;
  const [txHash, setTxHash] = useState(null);

  const validateAddress = (address) => {
    const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    return addressRegex.test(address);
  };

  const [formData, setFormData] = useState({
    addresses: "",
    amount: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const transfer = async (e) => {
    try {
      e.preventDefault();
      if (!contract) {
        alert("Please Connect Your Wallet first");
        return;
      }

      const addressString = formData.addresses;
      let amount = formData.amount;

      if (!validateAddress(addressString)) {
        alert("Invalid address");
        return;
      }

      amount *= 1;
      if (amount <= 0) {
        alert("Invalid amount");
        return;
      }

      const isSenderAddedToSystemAlready =
        await contract.isUserAddedToTheCreditSystem(state.signer.address);

      if (!isSenderAddedToSystemAlready) {
        alert("You are not part of this credit system");
        return;
      }

      const isReceiverAddedToSystemAlready =
        await contract.isUserAddedToTheCreditSystem(addressString);

      if (!isReceiverAddedToSystemAlready) {
        alert("Receiver is not part of this credit system");
        return;
      }

      let balanceOfSender = await contract.balanceOf(state.signer.address);
      balanceOfSender = parseInt(balanceOfSender);
      if (balanceOfSender < amount) {
        alert("Insufficient fund to transfer");
        return;
      }

      const tx = await contract.transferToken(addressString, amount);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      if (receipt && receipt.status === 1) {
        alert("transfered Successfully");
      }

      // Reset form data
      setFormData({
        addresses: "",
        amount: "",
      });

      let newBal = await contract.balanceOf(state.signer.address);
      newBal = newBal.toString();

      saveBalance(newBal);
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="form-container">
      <div className="tx-div">
        <form onSubmit={transfer}>
          <input
            className="addresses-input"
            type="text"
            name="addresses"
            placeholder="Enter Address"
            value={formData.addresses}
            onChange={handleChange}
          />
          <input
            className="amount-input"
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <button className="button" type="submit">
            Transfer
          </button>
        </form>
        <div>Previos Tx Hash:</div>
        <>
          {txHash === null ? (
            <></>
          ) : (
            <a href={`https://testnet.bscscan.com/tx/${txHash}`} target="blank">
              {txHash}
            </a>
          )}
        </>
      </div>
    </div>
  );
};

export default Transfer;
