import React, { useState } from "react";

const AddToCreditSystem = ({ state }) => {
  const { contract } = state;

  const [txHash, setTxHash] = useState(null);

  const validateAddress = (address) => {
    const addressRegex = /^(0x)?[0-9a-fA-F]{40}$/;
    return addressRegex.test(address);
  };

  const [formData, setFormData] = useState({
    addresses: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const addUser = async (e) => {
    try {
      e.preventDefault();
      if (!contract) {
        alert("Please Connect Your Wallet first");
        return;
      }

      const addressString = formData.addresses;

      if (!validateAddress(addressString)) {
        alert("Invalid address");
        return;
      }

      const isUserAddedToSystemAlready =
        await contract.isUserAddedToTheCreditSystem(addressString);
      if (isUserAddedToSystemAlready) {
        alert("User already Added to credit system");
        return;
      }

      const tx = await contract.addUserToCreaditSystem(addressString);
      const receipt = await tx.wait();
      setTxHash(receipt.hash);
      if (receipt && receipt.status === 1) {
        alert("User Added Successfully");
      }

      // Reset form data
      setFormData({
        addresses: "",
      });
    } catch (error) {
      alert(error.message);
    }
  };
  return (
    <div className="form-container">
      <div className="tx-div">
        <form onSubmit={addUser}>
          <input
            className="addresses-input"
            type="text"
            name="addresses"
            placeholder="Enter Address"
            value={formData.addresses}
            onChange={handleChange}
          />

          <button className="button" type="submit">
            Add User
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

export default AddToCreditSystem;
