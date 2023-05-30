import React, { useState } from "react";

const ExtraToken = ({ state }) => {
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

      const isUserAddedToSystemAlready =
        await contract.isUserAddedToTheCreditSystem(addressString);

      if (!isUserAddedToSystemAlready) {
        alert("First add this user to credit system then mint");
        return;
      }

      const tx = await contract.giveExtraTokenToUser(addressString, amount);
      const receipt = await tx.wait();

      setTxHash(receipt.hash);
      if (receipt && receipt.status === 1) {
        alert("Extra token mint Successfully");
      }

      // Reset form data
      setFormData({
        addresses: "",
        amount: "",
      });
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
            Mint
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

export default ExtraToken;
