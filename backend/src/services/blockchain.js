const { ethers } = require("ethers");

const provider = new ethers.JsonRpcProvider(
    process.env.ALCHEMY_ETH_URL
);

module.exports = {
    provider
}