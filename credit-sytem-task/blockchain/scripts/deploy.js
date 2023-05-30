const { ethers, network } = require("hardhat");

async function main() {
  const Contract = await ethers.getContractFactory("CreditSystem");
  const contract = await Contract.deploy("Token", "TT", 1000);
  await contract.deployed();

  console.log("Contract is deployed at", contract.address);

  if (network.name !== "hardhat") {
    console.log(`Waiting for 6 confirmations to verify....`);

    await contract.deployTransaction.wait(6);

    await run("verify:verify", {
      address: contract.address,
      constructorArguments: ["Token", "TT", 1000],
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
