const { ethers } = require("ethers");
const { provider } = require("./blockchain");

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)"
];

async function getTokenMetadata(contractAddress) {
  const contract = new ethers.Contract(
    contractAddress,
    ERC20_ABI,
    provider
  );

  const [name, symbol, decimals] = await Promise.all([
    contract.name(),
    contract.symbol(),
    contract.decimals()
  ]);

  return {
    name,
    symbol,
    decimals
  };
}

module.exports = {
  getTokenMetadata
};